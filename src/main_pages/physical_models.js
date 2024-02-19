/*
Antoine Model
log10(P) = A − (B / (T + C))
    P = vapor pressure (bar)
    T = temperature (K)
*/


export const Rg = 8.3144;

export function roundQuantity(input,n_digits) {
  if (!isNaN(input) && typeof input === "number") {
    // Input is a valid floating-point number
    const roundedValue = parseFloat(input.toFixed(n_digits));
    return roundedValue;
  } else {
    // Input is not a valid number
    return input;
  }
}

export function Antoine_T_P(T, A,B,C) {
    // Given a temperature in K, get saturation pressure in bar;
    const log_P = A-(B/(T+C));
    const P = 10.0 ** log_P;
    return P;
  }
  
export function Antoine_P_T(P,A,B,C) {
    // Given a pressure P in bar, get boiling point in K;
    const log_P = Math.log10(P);
    const T=B/(A-log_P)-C;
    return T;
  }

export function CC_T_P(T,P0,T0,dHvap) {
    const lnP_P0 = -dHvap/Rg*(1/T-1/T0);
    const P = (Math.E ** lnP_P0) * P0;
    return P;
  }

export function CC_P_T(P,P0,T0,dHvap) {
    const lnP_P0 = Math.log(P/P0);
    const T_T0 = -lnP_P0 / dHvap * Rg; 
    const T = 1/(T_T0+1/T0);
    return T;
  }

export const models = {
    'Antoine': {name_cn: '安托因方程',
                name_en: 'Antoine Equation',
                abbr: 'Antoine',
               },
    'CC':      {name_cn:'克劳修斯-克拉珀龙方程',
                name_en: 'Clausius Clapeyron Equation',
                abbr: 'CC',
              }
  }
  
export const substances = {
    'Water':   {name_cn: '水',
                name_en: 'Water',
                abbr: 'Water',
                antoine_params: {A: 5.08354, B:1663.125, C:-45.622, T_lo: 273,T_hi: 373.15, P_lo: 0.05, P_hi:3.0},
                CC_params: {P0:1.01325, T0:373.15, dHvap:41050},
               },
    'Ethanol': {name_cn: '乙醇 (酒精)',
                name_en: 'Ethanol (alcohol)',
                abbr: 'Ethanol',
                antoine_params: {A:5.24677,B:1598.673,C:-46.424, T_lo: 20 ,T_hi: 91, P_lo:0.05 , P_hi:3.0},
                CC_params: {P0:1.01325, T0:351.5, dHvap:42300},
               }
  }
