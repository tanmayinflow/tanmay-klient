import React from 'react';
import {createFinanceRoom} from './financeRoom.jsx';
import {createFinanceAdvanced} from './financeAdvanced.jsx';
import {createFinanceViews} from './financeViews.jsx';

// Both roles use the same room. Defaults are injected only by Main's caller.
export function createFinanceExperience(deps){
 const {L,useStore}=deps;
 const money=value=>new Intl.NumberFormat(L('cs-CZ','en-GB'),{style:'currency',currency:'CZK',maximumFractionDigits:2}).format(Number(value)||0);
 const {FinanceCalendar,InvestmentPortfolio}=createFinanceViews({...deps,money});
 const {FinancePlans,jarOptions}=createFinanceAdvanced({...deps,money,InvestmentPortfolio});
 const {FinanceRoom}=createFinanceRoom(deps);
 function PageFinance({historicExpenses=[]}){
  const st=useStore();
  return <FinanceRoom historicExpenses={historicExpenses} categories={jarOptions()}
   renderCalendar={month=><FinanceCalendar month={month} income={st.coll.income||[]} expenses={[...(st.coll.expenses||[]),...historicExpenses]}/>}
   renderPlans={month=><FinancePlans month={month}/>}/>;
 }
 return {PageFinance};
}
