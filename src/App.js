import React from "react";
import {useState} from "react";
import {OutputGraph, OutputTable} from './main_pages/output_graph.js';
import {Antoine_P_T, Antoine_T_P, CC_P_T, CC_T_P, substances, models, roundQuantity} from './main_pages/physical_models.js';

const CN = 0, EN = 1;
const model_pic_dir = './assets/';

function GraphicPageTitle({onClickLangFuncs,lang}) {
  const title_en = "Exploring Correlations of [Pressure vs Boiling Point] and [Temperature vs Saturation Pressure]";
  const title_cn = "汽压-沸点 及 温度-饱和蒸汽压 的关系探究";
  const title = (lang===CN)? title_cn:title_en;
  //const applist_use = [applist.ContactAngle, applist.PlaceHolderApp, applist.PlaceHolderApp];

  return (
    <div>
      
    <tr class='tr1'>
      <td width='940px'> <h1b>  {title} </h1b> </td> 
      <td width='60px' align="right"><lang> <div class="highlight_shift" onClick={onClickLangFuncs[0]}>简体中文</div>
                                             <div class="highlight_shift" onClick={onClickLangFuncs[1]}>English</div></lang></td>
    </tr>


    </div>
  )
}

function FootNote({lang}) {

  //const footnote_cn = 'Copyright © 2024 浙江大学化学系 版权所有';
  //const footnote_en = "Copyright © 2024 Department of Chemistry, Zhejiang University";

  const footnote_cn = 'Copyright © 2024 制作人 龙君纶 杭州绿城育华学校';
  const footnote_en = "Copyright © 2024 made with react.js by Long Junlun Hangzhou GreenTown Yuhua School";

  const declare_cn = '本应用程序只能用于非盈利的教学目的'
  const declare_en = 'For non-profitable educational purpose only'

  const footnote = (lang===CN)? footnote_cn:footnote_en;
  const declare = (lang===CN)? declare_cn:declare_en;

  return (
    <tr>
      {declare}
      <br/>
      {footnote}
    </tr>

  )

}


function Main({lang}) {
  const model_list = ['Antoine','CC'];
  const substance_list = ['Water','Ethanol'];
  const [selectedModel, setSelectedModel] = useState('Antoine');
  const [selectedSubstance, setSelectedSubstance] = useState('Water');
  const [TP_data, setTP_data] = useState([]);


  const select_model_cap_cn = "请选择一个 [气压-沸点] 的关系模型", select_model_cap_en = "Select a model for P-T correlation";
  const select_model_cap = (lang===CN) ? select_model_cap_cn : select_model_cap_en;

  const select_substance_cap_cn = "请选择一个纯物质", select_substance_cap_en = "Select a pure substance to explore";
  const select_substance_cap = (lang===CN) ? select_substance_cap_cn : select_substance_cap_en;


  const press_cap_cn = '输入气压', press_cap_en = 'Input Pressure';
  const press_cap = (lang===CN) ? press_cap_cn : press_cap_en;
  const press_unit_cn = '个标准大气压', press_unit_en = 'atm';
  const press_unit = (lang===CN) ? press_unit_cn : press_unit_en;
  const calculateT_en = 'Get Boiling point', calculateT_cn = '计算沸点';
  const calculateT = (lang===CN) ? calculateT_cn : calculateT_en;

  const temp_cap_cn = '输入气温', temp_cap_en = 'Input Temperature';
  const temp_cap = (lang===CN) ? temp_cap_cn : temp_cap_en;
  const calculateP_en = 'Get P_Sat', calculateP_cn = '计算饱和蒸汽压';
  const calculateP = (lang===CN) ? calculateP_cn : calculateP_en;
  const clear_data_cn='清除计算结果', clear_data_en = 'Clear All results';
  const clear_data = (lang===CN) ? clear_data_cn:clear_data_en;


  const [P_in, setP_in] = useState('[0.01-3.0]');
  const [T_out, setT_out] = useState('');
  const [T_in, setT_in] = useState('[5-100]');
  const [P_out, setP_out] = useState('');

  const onSelectModel = (e)=>{
    const newModel = e.target.value;
    setSelectedModel(newModel);
  }

  const onSelectSubstance = (e)=>{
    const newSub = e.target.value;
    setSelectedSubstance(newSub);
  } 

  const P_in_Change = (e)=>{
    const newP = e.target.value;
    setP_in(newP);
  } 

  const T_in_Change = (e)=>{
    const newT = e.target.value;
    setT_in(newT);
  } 

  const handleCalculateT = ()=>{
    const alert_info = 'Please input correct pressure';
    const {A,B,C} = substances[selectedSubstance].antoine_params;
    const {P0,T0,dHvap} = substances[selectedSubstance].CC_params;
    const model_sub = models[selectedModel].abbr + '-' + substances[selectedSubstance].abbr

    let Pn = parseFloat(P_in);
    if (isNaN(Pn)) {alert(alert_info); return};
    if (Pn<0.05) Pn=0.05; if (Pn>3.0) Pn=3.0;
    const Pn_bar = Pn * 1.01325;
    const T_out_K = selectedModel==='Antoine' ? Antoine_P_T(Pn_bar,A,B,C) : CC_P_T(Pn_bar,P0,T0,dHvap);
    const T_out_C = T_out_K - 273.15;
  
    setT_out(T_out_C); setP_in(Pn);
    setTP_data(prevTP => [...prevTP, [T_out_C,Pn, model_sub]]);
    
  }

  const handleCalculateP = ()=>{
    const alert_info = 'Please input correct temperature';
    const {A,B,C} = substances[selectedSubstance].antoine_params;
    const {P0,T0,dHvap} = substances[selectedSubstance].CC_params;
    const model_sub = models[selectedModel].abbr + '-' + substances[selectedSubstance].abbr

    let Tn = parseFloat(T_in);
    if (isNaN(Tn)) {alert(alert_info);return};
    if (Tn<5.0) Tn=5.0; if (Tn>100) Tn=100.0;
    const Tn_K = Tn + 273.15;
    const P_out_bar = selectedModel==='Antoine' ? Antoine_T_P(Tn_K,A,B,C) : CC_T_P(Tn_K,P0,T0,dHvap);
    const P_out_atm = P_out_bar/1.01325;
  
    setP_out(P_out_atm); setT_in(Tn);
    setTP_data(prevTP => [...prevTP, [Tn,P_out_atm, model_sub]]);

    
  }

  const handleClearData = ()=>{
    setTP_data([]);
   
  }


  return (
    <table>
      <tr>  {/* first line*/}
        <td width='300px'>

          {select_model_cap}<br/>

          {
            model_list.map((m0)=>{ 
                const model_name = (lang===CN)?models[m0].name_cn:models[m0].name_en;
                const model_abbr = models[m0].abbr;
                return (
                  <div>
                    <input type="radio" name="model" value={model_abbr} 
                      checked={model_abbr===selectedModel} onClick={onSelectModel}/> {model_name}
                  </div>
            )
            })
          }

        </td>

        <td width='400px' align="center">
          <img src={model_pic_dir + selectedModel + '_model.png'} width='262px' height='88px' alt='model'/>

        </td>


        <td width='300px'>
          {select_substance_cap} <br/>
          {
            substance_list.map((s0)=>{ 
                const substance_name = (lang===CN)?substances[s0].name_cn:substances[s0].name_en;
                const substance_abbr = substances[s0].abbr;
                return (
                  <div>
                    <input type="radio" name="substance" value={substance_abbr} 
                    checked={(substance_abbr===selectedSubstance)?true:false} onClick={onSelectSubstance}/> {substance_name}
                  </div>
            )
            })
          }
        </td>        

      </tr>

      <tr>     <td/>  <td> <br/><hr/><br/> </td> <td/>     </tr> {/* a separator line*/}

      <tr> {/* second line*/}
        <td width='300px'>  
          <tr>
              {press_cap}  <input type="number" placeholder='[0.05-3.0]' class='inputBox1' value={P_in} onChange={P_in_Change}/> {' '+press_unit}
              <br/>
              <button onClick={handleCalculateT}>{calculateT}</button> &nbsp;
              <input class='inputBox2' value={roundQuantity(T_out,2)} readonly="true"/> &nbsp; <sup>o</sup>C

          </tr>
          <tr>
              <br/>  <br/>
              {temp_cap}  <input type="number" placeholder='[5-100]' class='inputBox1' value={T_in} onChange={T_in_Change}/> &nbsp; <sup>o</sup>C
              <br/>

              <button onClick={handleCalculateP}>{calculateP}</button> &nbsp;

              <input class='inputBox2' value={roundQuantity(P_out,4)} readonly="true"/> {' '+press_unit}

          </tr>

          <tr>
            <br/> <br/>
            <button onClick={handleClearData}>{clear_data}</button><br/>
          </tr>

        </td>   

        <td width='400px' align="center">
          
          <OutputGraph data={TP_data} lang={lang}/>

        </td>
        <td width='300px'>
          <OutputTable data={TP_data} lang={lang}/>

        </td> 
      </tr>

    </table>
  );
}

export default function PressTemp(){

  //const [showAppState, setAppState] = useState('ContactAngle');
  const [lang, setLang] = useState(CN);

  const onClickLangFuncs = [()=>{setLang(CN)}, ()=>{setLang(EN)}];
  
  return (
    <div>
      <table width="1000px">
        <tr><GraphicPageTitle onClickLangFuncs={onClickLangFuncs} lang={lang}/></tr>
        <br/>
        <tr><Main lang={lang}/>        </tr>
        <br/>
        <tr><FootNote lang={lang}/></tr>
      </table>  

    </div>
  )
    
}