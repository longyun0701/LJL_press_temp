import React, { useRef, useEffect} from 'react';
import * as d3 from 'd3';

const CN = 0;
//const EN = 1;

export function OutputGraph({data, lang}) {
    const chartRef = useRef(null);
    const width = 360, height = 280;

    const temp_cap_cn = '温度', temp_cap_en = 'Temperature';
    const temp_cap = (lang===CN) ? temp_cap_cn : temp_cap_en;

    const press_cap_cn = '气压', press_cap_en = 'Pressure';
    const press_cap = (lang===CN) ? press_cap_cn : press_cap_en;


    useEffect( ()=> {

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        const svg = d3.select(chartRef.current);
        svg.selectAll('*').remove();
     
        const xScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([margin.left, width-margin.right]);

        const yScale = d3.scaleLinear()
                        .domain([0, 1])
                        .range([height-margin.bottom, margin.top]);
        console.log('UseEffect works');
        console.log(data.length);

        if (data.length >0) {

            console.log('data not empty');

            svg.selectAll('circle').data(data).join("circle")
                        .attr("cx", d => xScale(d[0]))
                        .attr("cy", d => yScale(d[1]))
                        .attr("r",  3)
                        .attr('fill','red')
                        ;
        }

        const XaxisGenerator = d3.axisBottom(xScale);
        svg.append("g").call(XaxisGenerator).attr('transform', `translate(0,${height - margin.bottom})`);

        const XaxisGenerator2 = d3.axisTop(xScale);
        svg.append("g").call(XaxisGenerator2).attr('transform', `translate(0,${margin.top})`);

        const YaxisGenerator = d3.axisLeft(yScale);
        svg.append("g").call(YaxisGenerator).attr('transform', `translate(${margin.left},0)`);

        const YaxisGenerator2 = d3.axisRight(yScale);
        svg.append("g").call(YaxisGenerator2).attr('transform', `translate(${width - margin.right},0)`);

        svg.append("text")             
            .attr("transform", `translate(${width/2},${height-8})`)
            .style("text-anchor", "middle") // Centers the text above the axis
            .text(temp_cap+" (C)");

        svg.append("text")
            .attr("transform", `translate(${12},${height/2-8}), rotate(-90)`) // Rotates the text -90 degrees
            .style("text-anchor", "middle") // Ensures the text is centered after rotation
            .text(press_cap+" (atm)");

            /*
     
        svg.append('g')
          .attr('transform', `translate(0,${margin.top})`)
          .call(d3.axisLeft(y).ticks(null).tickSizeOuter(0));
          */

    }, [data,lang]);



    return (
        <div>
            <svg width={width+'px'} height={height+'px'} ref={chartRef} />
        </div>
    );
}


export function OutputTable({data, lang}){

    const columns_cn = ['','模型-物质',' 温度 (C)', '气压 (atm)'];
    const columns_en = ['', 'Model-Sub.', 'Temp. (C)', 'Press. (atm)'];
    const cols = (lang===CN)?columns_cn: columns_en;
    const result_cap_cn = '暂无计算结果', result_cap_en = 'No computation results yet';
    const result_cap = (lang===CN)?result_cap_cn: result_cap_en;

    return (
        <div>

        {(data.length===0)?
        <tr align='center'>
            {result_cap}
        </tr>
        :
        <div>

        <br/>

        <tr className="underscore-row" align="center">
            <td width="30px">{cols[0]}</td>
            <td width="150px">{cols[1]}</td>
            <td width="60px">{cols[2]}</td>
            <td width="60px">{cols[3]}</td>
        </tr>

        {data.map((d,i)=>{
            //const model = (lang===CN)?models[selectedModel].name_cn:models[selectedModel].name_en;
            //const substance = (lang===CN)?substances[selectedSubstance].name_cn:substances[selectedSubstance].name_en;
            //const model_sub = models[selectedModel].abbr + '-' + substances[selectedSubstance].abbr;
            const temp = d[0].toFixed(2);
            const press = d[1].toFixed(4);
            const model_sub = d[2];

            return (

                <tr className="underscore-row2">
                    <td className="equip_intro" padding='2px' align="right">{i+1}</td>
                    <td className="equip_intro" padding="2px" align="center">{model_sub}</td>
                    <td className="equip_intro" padding="2px" align="right">{temp}</td>
                    <td className="equip_intro" padding="2px" align="right">{press}</td>                
                </tr>
                
            );

        })}
        </div>

        }

        </div>


    )


}



