import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.91.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const now = new Date()
    
    // Get all active investments
    const { data: investments, error: fetchError } = await supabase
      .from('user_investments')
      .select(`
        *,
        plan:investment_plans(*)
      `)
      .eq('status', 'active')
    
    if (fetchError) {
      console.error('Error fetching investments:', fetchError)
      throw fetchError
    }
    
    console.log(`Found ${investments?.length || 0} active investments to check`)
    
    let processedCount = 0
    let skippedCount = 0
    
    for (const investment of investments || []) {
      const startDate = new Date(investment.start_date)
      const endDate = new Date(investment.end_date)
      
      // Check if investment has ended
      if (now >= endDate) {
        // Mark investment as completed
        await supabase
          .from('user_investments')
          .update({ status: 'completed' })
          .eq('id', investment.id)
        
        console.log(`Investment ${investment.id} completed`)
        continue
      }
      
      // Determine the last payout time
      const lastPayoutAt = investment.last_payout_at 
        ? new Date(investment.last_payout_at) 
        : null
      
      // Calculate when the next payout should occur
      // It should be at the same time as start_date, but on a different day
      const startHour = startDate.getUTCHours()
      const startMinute = startDate.getUTCMinutes()
      const startSecond = startDate.getUTCSeconds()
      
      // Build today's payout time using start_date's time
      const todayPayoutTime = new Date(now)
      todayPayoutTime.setUTCHours(startHour, startMinute, startSecond, 0)
      
      // If we haven't reached today's payout time yet, check yesterday's
      let nextPayoutDue: Date
      if (now < todayPayoutTime) {
        // Today's payout time hasn't arrived yet
        // The last due payout was yesterday at the same time
        nextPayoutDue = new Date(todayPayoutTime)
        nextPayoutDue.setUTCDate(nextPayoutDue.getUTCDate() - 1)
      } else {
        // Today's payout time has passed
        nextPayoutDue = todayPayoutTime
      }
      
      // Make sure nextPayoutDue is after start_date
      if (nextPayoutDue <= startDate) {
        console.log(`Investment ${investment.id}: Payout time not yet reached (investment is new)`)
        skippedCount++
        continue
      }
      
      // Check if we already paid for this payout time
      if (lastPayoutAt && lastPayoutAt >= nextPayoutDue) {
        console.log(`Investment ${investment.id}: Already paid for ${nextPayoutDue.toISOString()}`)
        skippedCount++
        continue
      }
      
      // Calculate how many days of earnings are due
      const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
      const daysSinceLastPayout = lastPayoutAt 
        ? Math.floor((now.getTime() - lastPayoutAt.getTime()) / (24 * 60 * 60 * 1000))
        : daysSinceStart
      
      // Only pay for days that have passed at the exact time
      const daysToPayFor = Math.min(daysSinceLastPayout, daysSinceStart)
      
      if (daysToPayFor <= 0) {
        console.log(`Investment ${investment.id}: No days to pay for`)
        skippedCount++
        continue
      }
      
      // Calculate daily earnings
      const dailyReturn = investment.plan?.daily_return || 0
      const dailyEarnings = (investment.amount * dailyReturn) / 100
      const totalEarningsToAdd = dailyEarnings * daysToPayFor
      
      console.log(`Investment ${investment.id}: Processing ${daysToPayFor} day(s) of earnings = $${totalEarningsToAdd}`)
      
      // Update user balance
      const { error: balanceError } = await supabase
        .from('user_balances')
        .update({
          balance: supabase.rpc('increment', { amount: totalEarningsToAdd }),
          total_earnings: supabase.rpc('increment', { amount: totalEarningsToAdd }),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', investment.user_id)
      
      // Actually use raw SQL approach for the update
      const { data: currentBalance } = await supabase
        .from('user_balances')
        .select('balance, total_earnings')
        .eq('user_id', investment.user_id)
        .single()
      
      if (currentBalance) {
        await supabase
          .from('user_balances')
          .update({
            balance: (currentBalance.balance || 0) + totalEarningsToAdd,
            total_earnings: (currentBalance.total_earnings || 0) + totalEarningsToAdd,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', investment.user_id)
      }
      
      // Update investment total_earnings and last_payout_at
      await supabase
        .from('user_investments')
        .update({
          total_earnings: (investment.total_earnings || 0) + totalEarningsToAdd,
          last_payout_at: now.toISOString()
        })
        .eq('id', investment.id)
      
      processedCount++
      console.log(`Investment ${investment.id}: Successfully credited $${totalEarningsToAdd}`)
    }
    
    const result = {
      success: true,
      message: `Processed ${processedCount} investments, skipped ${skippedCount}`,
      timestamp: now.toISOString()
    }
    
    console.log(result)
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error processing daily earnings:', errorMessage)
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
