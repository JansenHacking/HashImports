document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS HTML ---
    const currentInflationInput = document.getElementById('currentInflation');
    const contractValueInput = document.getElementById('contractValueInput'); 
    const carValueInput = document.getElementById('carValueInput'); 
    const calculateBtn = document.getElementById('calculateBtn'); 
    const resetContractBtn = document.getElementById('resetContractBtn'); // NOVO BOTÃO
    const totalCostDisplay = document.getElementById('totalCost');
    const finalCostDisplay = document.getElementById('finalCostDisplay'); 
    const alertStatusSpan = document.getElementById('alertStatus'); 
    const carSelector = document.getElementById('carSelector');
    const dynamicPieceSelectors = document.getElementById('dynamicPieceSelectors');
    const selectedPiecesList = document.getElementById('selectedPiecesList');
    
    // NOVOS ELEMENTOS DE RESULTADO
    const resultCarModel = document.getElementById('resultCarModel');
    const resultInflationFactor = document.getElementById('resultInflationFactor');
    const resultFinalStatus = document.getElementById('resultFinalStatus'); 
    
    // Fator de correção para evitar problemas de ponto flutuante
    const DECIMAL_FACTOR = 100000; 
    
    // --- DADOS BASE ---
    const PRECOS_BASE_RAW = {
        "Classe A": {
        "Cabeçote": {
        "cabeçote": {
            "TakaShing": 2600.1701,
            "OEM": 3120.39312,
            "ProRacing Header S1": 5460.21546,
            "ProRacing Header S2": 7800.510301,
            "Edelbrock E-Street Header": 11701.0017,
            "Edelbrock Victor Header": 15601.0206,
            "TrickFlow PowerPort": 20281.13778,
            "TrickFlow GenX": 26001.701,
            "ProRacing Header S3": 34842.18484,
            "ProRacing Header S4": 43682.66868,
            "Edelbrock Masterflow Header": 50573.14307
        },
        "coletor de admissão": {
            "TakaShing Polido": 1820.07182,
            "TakaShing Plenum": 2638.915139,
            "Folego Turbo Individual": 3822.056322,
            "Folego Turbo Variável": 6461.443961,
            "ProRacing Variável": 7972.027972,
            "Mann-Hummel GF50": 10374.22037,
            "TrickFlow StreetBurner": 12467.39747,
            "TrickFlow TrackHeat Variável": 16380.64638,
            "Edelbrock Perfomer Variável": 23260.72576,
            "Edelbrock Flathead Variável": 29084.76658
        },
        "coletor de escape": {
            "TakaShing Polido": 1494.991495,
            "Bellows Manel": 3333.963334,
            "Bellows Hastelloy": 5531.563032,
            "BBK Titanium Variável": 7459.83746,
            "ProRacing Cerâmico": 8042.903043,
            "ProRacing H-Cerâmico": 8969.94897,
            "ProRacing Y-Variável": 11660.83916,
            "FMIC Vanos": 15129.46513,
            "FMIC R6": 21528.06653
        },
        "comandos": {
            "Comando OEM": 1950.00945,
            "Comando 260": 2924.777925,
            "Comando 264": 3900.0189,
            "Comando 268": 4875.259875,
            "Comando 272": 5850.02835,
            "Comando 280": 6824.796825,
            "Comando 288": 7800.0378,
            "Comando 292": 8775.278775,
            "Comando 304": 9750.04725,
            "Comando 312": 10724.81572,
            "Comando 320": 11700.0567
        },
        "juntas": {
            "TakaShing Aluminium": 406.3504064,
            "SPA Aço": 499.9054999,
            "BBK Aço": 690.7956908,
            "ProRacing Carbon": 808.4483084,
            "Edelbrock Racing Series": 1117.463617,
            "Edelbrock Carbon": 1422.226422
        },
        "molas": {
            "TakaShing SPR1": 714.8932149,
            "OEM Aço": 1229.446229,
            "Edelbrock Magnum": 1587.129087,
            "ProRacing Carbon": 2180.589681,
            "ProRacing M1": 2988.092988
        },
        "tuchos": {
            "TakaShing TPT1": 991.3059913,
            "OEM Aço": 1536.571537,
            "Edelbrock Flat": 1952.844453,
            "Edelbrock Performer": 2498.109998,
            "Crower 350T": 3152.523153,
            "Edelbrock M-Tec": 3172.368172,
            "ProRacing OBB": 3935.456435,
            "ProRacing OBB+": 5095.445095
        },
        "válvulas": {
            "TakaShing Aço": 2762.710263,
            "Bosch Aço": 5249.007749,
            "Eaton Aço": 7873.747874,
            "Continental Aço": 10470.61047,
            "ProRacing Carbon": 14310.62181,
            "ProRacing Tungstênio": 18786.61879
        }
    },
    "ECU": {
        "chip": {
            "Remapeamento ECU": 2437.629938,
            "Chip TakaShing": 7800.510301,
            "Chip Nascar Parts": 9677.282177,
            "Chip MNS GT2": 12529.29503,
            "Chip Folego Turbo": 15966.26347,
            "Chip ProRacing GT-R": 17502.3625
        },
        "módulo de injeção": {
            "ProCrane 3": 7312.417312,
            "ProCrane+": 10968.62597,
            "ProRacing Ftech+": 21937.25194,
            "ProRacing Ftech+ V2": 36562.08656,
            "ProRacing Ftech+ V300": 58499.3385,
            "ProRacing Ftech+ V450": 73124.17312
        }
    },
    "Motor": {
        "bielas": {
            "OEM": 3412.398412,
            "TakaShing Forjado": 6449.63145,
            "OEM Forjado": 9486.391986,
            "ProRacing Steel+": 12011.43451,
            "ProRacing Carbon+": 13990.73899
        },
        "bloco": {
            "OEM": 11374.97637,
            "ProRacing Aluminium": 25025.04253,
            "TAPerformance V3800": 43224.81572,
            "TAPerformance V4550": 51187.39369,
            "Edelbrock 350 SBC": 68249.85825,
            "Brodix BS Aluminium": 92250.99225
        },
        "bomba de óleo": {
            "OEM": 1039.97354,
            "TakaShing P1": 2287.847288,
            "Melling M295": 3951.993952,
            "Melling M295HV": 4263.844264,
            "Edelbrock Performer": 5407.767908
        },
        "bronzinas": {
            "OEM": 1462.388962,
            "TakaShing": 3217.255717,
            "Mahie": 5557.078057,
            "Takao": 6142.033642,
            "King Aluminium": 6726.989227,
            "King Cobre": 7457.947458,
            "King pMaxKote": 8481.855982
        },
        "cárter": {
            "TakaShing": 1283.783784,
            "OEM Aço": 1989.69949,
            "Edelbrock Aluminium": 2528.822529,
            "ProRacing Carbon": 3235.210735,
            "Edelbrock DOPS": 4107.919108,
            "ProRacing Dry+": 5096.390096
        },
        "pistões": {
            "OEM": 6013.041013,
            "TakaShing Forjado": 8719.051219,
            "OEM Forjado": 13709.60121,
            "ProRacing Steel+": 18760.63126,
            "ProRacing Titanium+": 31448.21395
        },
        "virabrequim": {
            "OEM": 5362.880363,
            "TakaShing Forjado": 7776.412776,
            "OEM Forjado": 12227.36723,
            "ProRacing Steel+": 16732.18673,
            "ProRacing Titanium+": 28048.10055
        }
    },
    "Óxido Nitroso": {
        "kit instalação": {
            "Kit Nitro": 3412.870913
        },
        "bico injetor": {
            "TakaShing 0.3mm": 2631.012203876525,
            "TakaShing 0.5mm": 8419.136498820634,
            "NX 0.5mm":  12602.29720028715,
            "NX 0.6mm": 15838.88831914675,
            "NOS 0.7mm": 18417.08542713568,
            "NOS 0.8mm": 20521.99774382115,
            "NOS 2.0mm EC": 22363.86011691109
        },
        "garrafas": {
            "TakaShing 10 Lbs": 3087.790588,
            "TakaShing 20 Lbs": 4631.449631,
            "NX 20 Lbs": 5249.480249,
            "NX Dual 40 Lbs": 6175.581176,
            "NOS 20 Lbs": 11085.33359,
            "NOS 30 Lbs": 15408.24041,
            "NOS Dual 40 Lbs": 17909.18541,
            "NOS Dual 60 LBs": 20070.87507
        }
    },
    "Redução de Peso": {
        "reduções": {
            "ProReduction Light Pack": 6500.661501,
            "ProReduction Super Pack": 13001.323,
            "ProReduction Ultra Pack": 19501.9845,
            "ProReduction Extreme Pack": 29252.97675,
            "ProReduction Nismo Pack": 39003.969,
            "ProReduction Apex Pack": 48754.96125
        }
    },
    "SuperCharger": {
        "kit instalação": {
            "Kit Supercharger": 2843.980344
        },
        "remover tudo": {
            "Remover Supercharger": 711.1132111
        },
        "compressor": {
            "TakaShing Blower": 6370.723871,
            "Vortech Blower": 14015.78152,
            "Edelbrock Blower": 23571.63107,
            "Vortech CCSq V-30": 22170.19467,
            "Vortech Sc 2200x": 36313.07881,
            "ProRacing Sc Kompressor": 43002.268,
            "ProRacing SC Kompressor HP": 46060.29106
        },
        "polias": {
            "TakaShing 3.9": 5687.960688,
            "Magnuson 3.6": 8531.941032,
            "Magnuson 3.2": 12513.70251,
            "Edelbrock 3.0": 15926.10093,
            "Edelbrock 2.6": 18770.08127,
            "ProRacing 2.2": 22751.84275,
            "ProRacing 2.1": 27302.0223,
            "ProRacing 2.0": 30146.00265
        }
    },
    "Turbo": {
        "kit instalação": {
            "Kit Turbo": 3542.808543
        },
        "remover tudo": {
            "Remover Turbo": 885.4658855
        },
        "intercooler": {
            "TakaShing": 5395.482895,
            "ProRacing I-Flow": 8632.583633,
            "HKS S-Type": 12139.95464,
            "HKS R-Type": 20610.94311,
            "Garret F80": 26923.54942,
            "Mashimoto TMIC": 32480.62748,
            "Mashimoto R-Line": 39009.16651,
            "ProRacing Competition": 45537.70554
        },
        "Turbinas": {
            "TakaShing .36": 10270.74277,
            "SPA .42": 14789.73729,
            "SPA .48": 21773.76677,
            "Garret .58": 33174.73067,
            "Garret .63": 42931.86543,
            "HKS .70": 52585.99509,
            "HKS .82": 63678.41618,
            "MasterPower .70": 74462.76696,
            "MasterPower .82": 84322.90682,
            "MasterPower .84": 95415.32792
        },
        "válvula de alívio": {
            "TakaShing": 1544.131544,
            "Beep Turbo USC": 2316.197316,
            "SPA MCSI": 3088.263088,
            "HKS ControFlow": 3860.32886,
            "HKS GT II": 6331.033831,
            "ProRacing WGV": 8801.738802
        },
        "válvula de prioridade": {
            "TakaShing": 1868.739369,
            "Beep Turbo USC": 2802.872803,
            "SPA MCSI": 3737.478737,
            "HKS ControFlow": 4672.084672,
            "HKS GT II": 7661.595162,
            "ProRacing BOV": 10652.05065
        }
    },
    "Transmissão": {
        "caixa de marchas": {
            "Z-Pro One": 4875.259875,
            "Z-Pro Carbon": 6094.311094
        }
    }
    },
    "Classe B": {
    "Cabeçote": {
            "cabeçote": {
                "TakaShing": 8143.134714,
                "OEM": 9772.35356133,
                "ProRacing Header S1": 17100.1389710025,
                "ProRacing Header S2": 24429.4041451318,
                "Edelbrock E-Street Header": 36644.8460936625,
                "Edelbrock Victor Header": 48858.808284,
                "TrickFlow PowerPort": 63515.85886467,
                "TrickFlow GenX": 81431.34714,
                "ProRacing Header S3": 109117.709215335,
                "ProRacing Header S4": 136804.07129067,
                "Edelbrock Masterflow Header": 158383.4522708363
            },
            "coletor de admissão": {
                "TakaShing Polido": 5700.0463236675,
                "TakaShing Plenum": 8264.4752647879,
                "Folego Turbo Individual": 11969.8013274368,
                "Folego Turbo Variável": 20235.7563535496,
                "ProRacing Variável": 24966.5580416344,
                "Mann-Hummel GF80": 32489.6721278477,
                "TrickFlow StreetBurner": 39045.0213742527,
                "TrickFlow TrackHeat Variável": 51300.4169130075,
                "Edelbrock Perfomer Variável": 72847.2431127064,
                "Edelbrock Flathead Variável": 91086.7994313853
            },
            "coletor de escape": {
                "TakaShing Polido": 4681.9695142519,
                "Bellows Manel": 10441.2063504224,
                "Bellows Hastelloy": 17323.5831565628,
                "BBK Titanium Variável": 23362.4951618833,
                "ProRacing Cerâmico": 25188.5224627379,
                "ProRacing H-Cerâmico": 28091.8170855113,
                "ProRacing Y-Variável": 36519.0662557679,
                "FMIC Vanos": 47382.0050097321,
                "FMIC R6": 67420.9529160206
            },
            "comandos": {
                "Comando OEM": 6106.9810951688,
                "Comando 260": 9159.7317620906,
                "Comando 264": 12213.9621903375,
                "Comando 268": 15268.1926185844,
                "Comando 272": 18320.9432855063,
                "Comando 280": 21373.6939524281,
                "Comando 288": 24427.924380675,
                "Comando 292": 27482.1548089219,
                "Comando 304": 30534.9054758438,
                "Comando 312": 33587.6561271068,
                "Comando 320": 36641.8865710125
            },
            "juntas": {
                "TakaShing Aluminium": 1272.5960122393,
                "SPA Aço": 1565.589047407,
                "BBK Aço": 2163.4132205563,
                "ProRacing Carbon": 2531.8741587739,
                "Edelbrock Racing Series": 3499.639031779,
                "Edelbrock Carbon": 4454.0860415848
            },
            "molas": {
                "TakaShing SPR1": 2238.8811236062,
                "OEM Aço": 3850.3428165589,
                "Edelbrock Magnum": 4970.523260747,
                "ProRacing Carbon": 6829.1053452008,
                "ProRacing M1": 9358.0199769403
            },
            "tuchos": {
                "TakaShing TPT1": 3104.5423643442,
                "OEM Aço": 4812.188642385,
                "Edelbrock Flat": 6115.859672514,
                "Edelbrock Performer": 7823.5059483625,
                "Crower 350T": 9872.9774347775,
                "Edelbrock M-Tec": 9935.1274699305,
                "ProRacing OBB": 12324.9443993234,
                "ProRacing OBB+": 15957.7620850173
            },
            "válvulas": {
                "TakaShing Aço": 8652.1731202737,
                "Bosch Aço": 16438.6849979303,
                "Eaton Aço": 24658.7673791238,
                "Continental Aço": 32791.5437513218,
                "ProRacing Carbon": 44817.5760654799,
                "ProRacing Tungstênio": 58835.369127402
            }
        },
        "ECU": {
            "chip": {
                "Remapeamento ECU": 7634.0963108581,
                "Chip TakaShing": 24429.4041451318,
                "Chip NascarParts": 30307.0220031767,
                "Chip MNS GT2": 39238.8702957321,
                "Chip Folego Turbo": 50002.6649469691,
                "Chip ProRacing GT-R": 54813.3738061067
            },
            "módulo de injeção": {
                "ProCrane 3": 22900.8091649857,
                "ProCrane+": 34351.2137537421,
                "ProRacing Ftech+": 68702.4275074842,
                "ProRacing Ftech+ V2": 114504.0458249285,
                "ProRacing Ftech+ V300": 183206.4733324126,
                "ProRacing Ftech+ V450": 229008.0916498569
            }
        },
        "Motor": {
            "bielas": {
                "OEM": 10686.8469746482,
                "TakaShing Forjado": 20198.7622859755,
                "OEM Forjado": 29709.1978297143,
                "ProRacing Steel+": 37617.050255027,
                "ProRacing Carbon+": 43815.776646298
            },
            "bloco": {
                "OEM": 35623.809745938,
                "ProRacing Aluminium": 78372.677443437,
                "TAPerformance V3800": 135370.1811261444,
                "TAPerformance V4550": 160307.1439350155,
                "Edelbrock 350 SBC": 213742.8585695814,
                "Brodix BS Aluminium": 288908.8899960506
            },
            "bomba de óleo": {
                "OEM": 3256.957933335,
                "TakaShing P1": 7165.011501072,
                "Melling M295": 12376.736098938,
                "Melling M295HV": 13353.379550541,
                "Edelbrock Performer": 16935.885301077
            },
            "bronzinas": {
                "OEM": 4579.8658794794,
                "TakaShing": 10075.7049367338,
                "Mahie": 17403.4903464063,
                "Takao": 19235.4366988245,
                "King Aluminium": 21067.3830512426,
                "King Cobre": 23356.5761103198,
                "King pMaxKote": 26563.222108497
            },
            "cárter": {
                "TakaShing": 4020.5155411797,
                "OEM Aço": 6231.2811717384,
                "Edelbrock Aluminium": 7919.6905315714,
                "ProRacing Carbon": 10131.9359234551,
                "Edelbrock DOPS": 12865.0578247395,
                "ProRacing Dry+": 15960.721610799
            },
            "pistões": {
                "OEM": 18831.4614531049,
                "TakaShing Forjado": 27306.0630358694,
                "OEM Forjado": 42935.3177810357,
                "ProRacing Steel+": 58753.9821605746,
                "ProRacing Titanium+": 98488.5730012602
            },
            "virabrequim": {
                "OEM": 16795.3078342737,
                "TakaShing Forjado": 24353.9362392632,
                "OEM Forjado": 38293.301869535,
                "ProRacing Steel+": 52401.3604349166,
                "ProRacing Titanium+": 87840.1998586429
            }
        },
        "Óxido Nitroso": {
            "kit instalação": {
                "Kit Nitro": 10688.3267391049
            },
            "bico injetor": {
                "TakaShing 0.3mm": 8239.725089734384,
                "TakaShing 0.5mm": 26366.799112911493,
                "NX 0.5mm": 39467.49630294329,
                "NX 0.6mm": 49603.75527125422,
                "NOS 0.7mm": 57678.07562814071,
                "NOS 0.8mm": 64270.17687416676,
                "NOS 2.0mm EC": 70038.46619833865
            },
            "garrafas": {
                "TakaShing 10 Lbs": 9670.2499296893,
                "TakaShing 20 Lbs": 14504.6350107397,
                "NX 20 Lbs": 16440.1647592553,
                "NX Dual 40 Lbs": 19340.4998593786,
                "NOS 20 Lbs": 34716.715176826,
                "NOS 30 Lbs": 48255.0650683694,
                "NOS Dual 40 Lbs": 56087.4495909453,
                "NOS Dual 60 LBs": 62857.3644173795
            }
            
        },
        "Redução de Peso": {
            "reduções": {
                "ProReduction Light Pack": 20358.5766687943,
                "ProReduction Super Pack": 40717.153331325,
                "ProReduction Ultra Pack": 61075.7299969875,
                "ProReduction Extreme Pack": 91613.5949954812,
                "ProReduction Nismo Pack": 122151.459993975,
                "ProReduction Apex Pack": 152689.3249924687
            }
        },
        "SuperCharger": {
            "kit instalação": {
                "Kit Supercharger": 8906.6923218447
            },
            "remover tudo": {
                "Remover Supercharger": 2227.0430211056
            },
            "compressor": {
                "TakaShing Blower": 19951.641897293,
                "Vortech Blower": 43894.2040904753,
                "Edelbrock Blower": 73820.9270353959,
                "Vortech CCSq V-30": 69431.9505610094,
                "Vortech Sc 2200x": 113724.2108237183,
                "ProRacing Sc Kompressor": 134673.2128530866,
                "ProRacing SC Kompressor HP": 144250.2377316122
            },
            "polias": {
                "TakaShing 3.9": 17813.3846436893,
                "Magnuson 3.6": 26720.076965534,
                "Magnuson 3.2": 39190.0381093721,
                "Edelbrock 3.0": 49876.8851090745,
                "Edelbrock 2.6": 58783.5774183921,
                "ProRacing 2.2": 71253.5385684937,
                "ProRacing 2.1": 85503.6543776625,
                "ProRacing 2.0": 94410.3467182978
            }
        },
        "Turbo": {
            "kit instalação": {
                "Kit Turbo": 11095.2615106062
            },
            "remover tudo": {
                "Remover Turbo": 2773.0754962061
            },
            "intercooler": {
                "TakaShing": 16897.4114659144,
                "ProRacing I-Flow": 27035.2664440648,
                "HKS S-Type": 38019.5457425533,
                "HKS R-Type": 64548.7333029943,
                "Garret F80": 84318.3643662761,
                "Mashimoto TMIC": 101721.8547220777,
                "Mashimoto R-Line": 122167.7373998675,
                "ProRacing Competition": 142613.6200776573
            },
            "Turbinas": {
                "TakaShing .36": 32165.6040844987,
                "SPA .42": 46318.0555522653,
                "SPA .48": 68190.4295566381,
                "Garret .58": 103895.6262694035,
                "Garret .63": 134452.7281964397,
                "HKS .70": 164687.241841452,
                "HKS .82": 199426.1534381529,
                "MasterPower .70": 233200.2596801141,
                "MasterPower .82": 264079.9498891743,
                "MasterPower .84": 298818.8615171928
            },
            "válvula de alívio": {
                "TakaShing": 4835.8648455072,
                "Beep Turbo USC": 7253.7972682607,
                "SPA MCSI": 9671.7296910143,
                "HKS ControFlow": 12089.6621137679,
                "HKS GT II": 19827.3418207234,
                "ProRacing WGV": 27565.0215276789
            },
            "válvula de prioridade": {
                "TakaShing": 5852.4618935978,
                "Beep Turbo USC": 8777.9529581683,
                "SPA MCSI": 11704.9237840638,
                "HKS ControFlow": 14631.8946130911,
                "HKS GT II": 23994.3538802699,
                "ProRacing BOV": 33359.7726638351
            }
        },
        "Transmissão": {
            "caixa de marchas": {
                "Z-Pro One": 15268.1926185844,
                "Z-Pro Carbon": 19085.9806546759
            }
        }
        },
        "Classe C": {
        "Cabeçote": {
                "cabeçote": {
                    "TakaShing": 13312.1050311076,
                    "OEM": 15975.4936616592,
                    "ProRacing Header S1": 27954.6948470785,
                    "ProRacing Header S2": 39936.3150984426,
                    "Edelbrock E-Street Header": 59905.6821703968,
                    "Edelbrock Victor Header": 79872.6301866458,
                    "TrickFlow PowerPort": 103833.4516183095,
                    "TrickFlow GenX": 133121.0503110763,
                    "ProRacing Header S3": 178381.7236046772,
                    "ProRacing Header S4": 223642.3968982782,
                    "Edelbrock Masterflow Header": 258919.5961837547
                },
                "coletor de admissão": {
                    "TakaShing Polido": 9318.2316156928,
                    "TakaShing Plenum": 13510.4682184247,
                    "Folego Turbo Individual": 19567.80258079,
                    "Folego Turbo Variável": 33080.6898600395,
                    "ProRacing Variável": 40814.4350533806,
                    "Mann-Hummel GF50": 53112.9525646404,
                    "TrickFlow StreetBurner": 63829.4027706901,
                    "TrickFlow TrackHeat Variável": 83864.0845412356,
                    "Edelbrock Perfomer Variável": 119088.0644373655,
                    "Edelbrock Flathead Variável": 148905.4379627737
                },
                "coletor de escape": {
                    "TakaShing Polido": 7653.9161042013,
                    "Bellows Manel": 17068.9102501677,
                    "Bellows Hastelloy": 28319.9734002695,
                    "BBK Titanium Variável": 38192.1704978114,
                    "ProRacing Cerâmico": 41177.2945406268,
                    "ProRacing H-Cerâmico": 45923.4966252076,
                    "ProRacing Y-Variável": 59700.0617954852,
                    "FMIC Vanos": 77458.4050770527,
                    "FMIC R6": 110217.3595350677
                },
                "comandos": {
                    "Comando OEM": 9983.4740081246,
                    "Comando 260": 14974.0014817742,
                    "Comando 264": 19966.9480162489,
                    "Comando 268": 24959.8945507237,
                    "Comando 272": 29950.4220243735,
                    "Comando 280": 34940.9494980231,
                    "Comando 288": 39933.8960324979,
                    "Comando 292": 44926.8425669727,
                    "Comando 304": 49917.3700406224,
                    "Comando 312": 54907.8974886736,
                    "Comando 320": 59900.8440487468
                },
                "juntas": {
                    "TakaShing Aluminium": 2080.3943901324,
                    "SPA Aço": 2559.3689121712,
                    "BBK Aço": 3536.6704628156,
                    "ProRacing Carbon": 4139.0172103133,
                    "Edelbrock Racing Series": 5721.0845697924,
                    "Edelbrock Carbon": 7281.3803634156
                },
                "molas": {
                    "TakaShing SPR1": 3660.0426882745,
                    "OEM Aço": 6294.40255872,
                    "Edelbrock Magnum": 8125.6334360856,
                    "ProRacing Carbon": 11163.9768733674,
                    "ProRacing M1": 15298.1559548632
                },
                "tuchos": {
                    "TakaShing TPT1": 5075.1946859752,
                    "OEM Aço": 7866.7936718273,
                    "Edelbrock Flat": 9997.9883884335,
                    "Edelbrock Performer": 12789.5873707017,
                    "Crower 350T": 16139.9899667083,
                    "Edelbrock M-Tec": 16241.5906186318,
                    "ProRacing OBB": 20148.3777573122,
                    "ProRacing OBB+": 26087.1780215004
                },
                "válvulas": {
                    "TakaShing Aço": 14144.2627894133,
                    "Bosch Aço": 26873.3735780539,
                    "Eaton Aço": 40311.2699000532,
                    "Continental Aço": 53606.4414849071,
                    "ProRacing Carbon": 73266.1684692011,
                    "ProRacing Tungstênio": 96181.9546005318
                }
            },
            "ECU": {
                "chip": {
                    "Remapeamento ECU": 12479.9472779217,
                    "Chip TakaShing": 39936.3150984426,
                    "Chip NascarParts": 49544.8342998367,
                    "Chip MNS GT2": 64146.3000459451,
                    "Chip Folego Turbo": 81742.5660986476,
                    "Chip ProRacing GT-R": 89606.9406738119
                },
                "módulo de injeção": {
                    "ProCrane 3": 37437.4227627007,
                    "ProCrane+": 56156.1341542905,
                    "ProRacing Ftech+": 112312.268308581,
                    "ProRacing Ftech+ V2": 187187.1138135035,
                    "ProRacing Ftech+ V300": 299499.3821220843,
                    "ProRacing Ftech+ V450": 374374.2276270068
                }
            },
            "Motor": {
                "bielas": {
                    "OEM": 17470.4747464518,
                    "TakaShing Forjado": 33020.2132830983,
                    "OEM Forjado": 48567.5327486805,
                    "ProRacing Steel+": 61495.0067195184,
                    "ProRacing Carbon+": 71628.4626523829
                },
                "bloco": {
                    "OEM": 58236.5285116567,
                    "ProRacing Aluminium": 128120.8466197251,
                    "TAPerformance V3800": 221298.3246038066,
                    "TAPerformance V4550": 262064.3784304481,
                    "Edelbrock 350 SBC": 349419.1712235317,
                    "Brodix BS Aluminium": 472297.9077622252
                },
                "bomba de óleo": {
                    "OEM": 5324.3582002781,
                    "TakaShing P1": 11713.1042284467,
                    "Melling M295": 20233.0449732216,
                    "Melling M295HV": 21829.6267150575,
                    "Edelbrock Performer": 27686.1788292809
                },
                "bronzinas": {
                    "OEM": 7487.0007383272,
                    "TakaShing": 16471.4016273918,
                    "Mahie": 28450.6028128111,
                    "Takao": 31445.4031091661,
                    "King Aluminium": 34440.2034055209,
                    "King Cobre": 38182.494244272,
                    "King pMaxKote": 43424.6042945855
                },
                "cárter": {
                    "TakaShing": 6572.5948351767,
                    "OEM Aço": 10186.6753222112,
                    "Edelbrock Aluminium": 12946.8264830363,
                    "ProRacing Carbon": 16563.3260308957,
                    "Edelbrock DOPS": 21031.3358441396,
                    "ProRacing Dry+": 26092.01614827
                },
                "pistões": {
                    "OEM": 30784.998843504,
                    "TakaShing Forjado": 44638.9740420963,
                    "OEM Forjado": 70189.1200280013,
                    "ProRacing Steel+": 96048.9061015666,
                    "ProRacing Titanium": 161005.5923430333
                },
                "virabrequim": {
                    "OEM": 27456.3678205209,
                    "TakaShing Forjado": 39812.9428683758,
                    "OEM Forjado": 62600.5186428702,
                    "ProRacing Steel+": 85663.8675869188,
                    "ProRacing Titanium": 143598.0132394676
                }
            },
            "Óxido Nitroso": {
                "kit instalação": {
                    "Kit Nitro": 17472.8938123964
                },
                "bico injetor": {
                    "TakaShing 0.3mm": 13466.122046494865,
                    "TakaShing 0.5mm": 43125.48080402727,
                    "NX 0.5mm": 64558.25333416874,
                    "NX 0.6mm": 81093.66003377474,
                    "NOS 0.7mm": 94302.04974305542,
                    "NOS 0.8mm": 105070.29212498085,
                    "NOS 2.0mm EC": 114520.28296201445
                },
                "garrafas": {
                    "TakaShing 10 Lbs": 15808.5783009048,
                    "TakaShing 20 Lbs": 23711.657915825,
                    "NX 20 Lbs": 26875.7926388789,
                    "NX Dual 40 Lbs": 31617.1566018096,
                    "NOS 20 Lbs": 56753.6427924255,
                    "NOS 30 Lbs": 78885.6523973093,
                    "NOS Dual 40 Lbs": 91689.7541432002,
                    "NOS Dual 60 LBs": 102756.9684760545
                }
            },
            "Redução de Peso": {
                "reduções": {
                    "ProReduction Light Pack": 33281.4721133013,
                    "ProReduction Super Pack": 66562.9442163632,
                    "ProReduction Ultra Pack": 99844.4163245447,
                    "ProReduction Extreme Pack": 149766.624486817,
                    "ProReduction Nismo Pack": 199688.8326490895,
                    "ProReduction Apex Pack": 249611.0408113617
                }
            },
            "SuperCharger": {
                "kit instalação": {
                    "Kit Supercharger": 14560.3416660063
                },
                "remover tudo": {
                    "Remover Supercharger": 3640.6901822198
                },
                "compressor": {
                    "TakaShing Blower": 32616.2297208696,
                    "Vortech Blower": 71756.673029698,
                    "Edelbrock Blower": 120679.808047312,
                    "Vortech CCSq V-30": 113504.8664728291,
                    "Vortech Sc 2200x": 185912.2674788117,
                    "ProRacing Sc Kompressor": 220158.9458289051,
                    "ProRacing SC Kompressor HP": 235815.1231544843
                },
                "polias": {
                    "TakaShing 3.9": 29120.6833320124,
                    "Magnuson 3.6": 43681.0249980187,
                    "Magnuson 3.2": 64066.4709363265,
                    "Edelbrock 3.0": 81536.9457237359,
                    "Edelbrock 2.6": 96097.2873692634,
                    "ProRacing 2.2": 116482.7333178104,
                    "ProRacing 2.1": 139778.3123570426,
                    "ProRacing 2.0": 154338.6540537671
                }
            },
            "Turbo": {
                "kit instalação": {
                    "Kit Turbo": 18138.1362048281
                },
                "remover tudo": {
                    "Remover Turbo": 4533.3245195146
                },
                "intercooler": {
                    "TakaShing": 27623.2831812752,
                    "ProRacing I-Flow": 44196.2854708301,
                    "HKS S-Type": 62152.9919294751,
                    "HKS R-Type": 105521.9577636494,
                    "Garret F80": 137840.6426907443,
                    "Mashimoto TMIC": 166291.2455189145,
                    "Mashimoto R-Line": 199715.4423693612,
                    "ProRacing Competition": 233139.6392198079
                },
                "Turbinas": {
                    "TakaShing .36": 52583.1777319988,
                    "SPA .42": 75719.098603191,
                    "SPA .48": 111475.2723927873,
                    "Garret .58": 169844.8494034093,
                    "Garret .63": 219798.5054076034,
                    "HKS .70": 269224.805639981,
                    "HKS .82": 326014.7343447814,
                    "MasterPower .70": 381227.4338045849,
                    "MasterPower .82": 431708.4455805956,
                    "MasterPower .84": 488498.3743365929
                },
                "válvula de alívio": {
                    "TakaShing": 7905.498680865,
                    "Beep Turbo USC": 11858.2480212973,
                    "SPA MCSI": 15810.9973617298,
                    "HKS ControFlow": 19763.7467021623,
                    "HKS GT II": 32413.028406783,
                    "ProRacing WGV": 45062.3101114037
                },
                "válvula de prioridade": {
                    "TakaShing": 9567.3951315315,
                    "Beep Turbo USC": 14349.8831643249,
                    "SPA MCSI": 19134.7902579433,
                    "HKS ControFlow": 23919.6973566814,
                    "HKS GT II": 39225.110504259,
                    "ProRacing BOV": 54535.3617632471
                }
            },
            "Transmissão": {
                "caixa de marchas": {
                    "Z-Pro One": 24959.8945507237,
                    "Z-Pro Carbon": 31201.077720097
                }
            }
        }
    };

    const PRECOS_BASE = {};
    for (const car in PRECOS_BASE_RAW) {
        PRECOS_BASE[car] = {};
        for (const group in PRECOS_BASE_RAW[car]) {
            for (const category in PRECOS_BASE_RAW[car][group]) {
                PRECOS_BASE[car][category] = PRECOS_BASE_RAW[car][group][category];
            }
        }
    }
    let buildPrices = {};
    
    
    function parseContractValue(input) {
        if (!input) return 0;
        let value = input.toString().replace(/\s/g, '').replace(',', '.').toLowerCase();
        let numericValue = 0;
        if (value.endsWith('kk')) {
            numericValue = parseFloat(value.replace('kk', '')) * 1000000;
        } else if (value.endsWith('k')) {
            numericValue = parseFloat(value.replace('k', '')) * 1000;
        } else {
            numericValue = parseFloat(value) || 0;
        }
        return isNaN(numericValue) ? 0 : Math.abs(numericValue);
    }
    
    function formatarValor(valor) {
        const formatter = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true 
        });
        return `Lp$${formatter.format(Math.abs(valor))}`;
    }
    
    function updatePieceSummary() {
        const selectedCar = carSelector.value;
        const pieceSelectors = dynamicPieceSelectors.querySelectorAll('select');
        let summaryHtml = '';
        let pieceCount = 0;
        
        if (!selectedCar) {
            selectedPiecesList.innerHTML = '<p class="placeholder-text-summary">Selecione um carro para começar.</p>';
            return;
        }
        pieceSelectors.forEach(selector => {
            const category = selector.dataset.category;
            const selectedPiece = selector.value;
            selector.classList.remove('selected-piece-highlight'); 
            if (selectedPiece) {
                pieceCount++;
                selector.classList.add('selected-piece-highlight'); 
                summaryHtml += `<span class="piece-item">1x <strong>${category.charAt(0).toUpperCase() + category.slice(1)}</strong> > ${selectedPiece}</span>`;
            }
        });
        if (pieceCount > 0) {
            selectedPiecesList.innerHTML = summaryHtml;
        } else {
            selectedPiecesList.innerHTML = '<p class="placeholder-text-summary">Nenhuma peça de tuning selecionada.</p>';
        }
    }

    // Função central que soma os custos e exibe o resultado
    function somarCustoTotalAtual() {
        let totalCents = 0; 
        for (const category in buildPrices) {
            const value = buildPrices[category] || 0;
            totalCents += Math.round(value * DECIMAL_FACTOR); 
        }
        let totalPartsCost = totalCents / DECIMAL_FACTOR; 
        const carValue = parseContractValue(carValueInput.value);
        const contractValue = parseContractValue(contractValueInput.value);
        
        let totalCost = totalPartsCost + carValue;
        totalCostDisplay.textContent = formatarValor(totalCost); 

        const finalCost = contractValue - totalCost; 
        let finalCostText = formatarValor(finalCost);
        
        finalCostDisplay.classList.remove('lucro', 'prejuizo', 'neutro');
        alertStatusSpan.style.color = 'white'; 
        
        resultFinalStatus.classList.remove('lucro', 'prejuizo', 'neutro');
        
        let finalStatusSummaryText = formatarValor(finalCost);


        if (finalCost > 0) {
            finalCostDisplay.classList.add('lucro');
            alertStatusSpan.textContent = '(Lucro)';
            alertStatusSpan.style.color = 'var(--cor-lucro)';
            
            resultFinalStatus.classList.add('lucro');
        } else if (finalCost < 0) {
            finalCostDisplay.classList.add('prejuizo');
            alertStatusSpan.textContent = '(Prejuízo)';
            alertStatusSpan.style.color = 'var(--cor-prejuizo)';
            
            finalCostText = `- ${finalCostText}`; 
            finalStatusSummaryText = `- ${finalStatusSummaryText}`;
            
            resultFinalStatus.classList.add('prejuizo');
        } else {
            finalCostDisplay.classList.add('neutro');
            alertStatusSpan.textContent = '(Neutro)';
            
            resultFinalStatus.classList.add('neutro');
        }
        
        finalCostDisplay.textContent = finalCostText;

        // --- ATUALIZAÇÃO DOS NOVOS CAMPOS DE DETALHE ---
        const selectedCar = carSelector.value || "---";
        const factor = parseFloat(currentInflationInput.value) || 1; 

        resultCarModel.textContent = selectedCar;
        resultInflationFactor.textContent = factor.toFixed(4); 
        resultFinalStatus.textContent = finalStatusSummaryText;
        // ----------------------------------------------

        updatePieceSummary();
    }
    
    function recalcularEPopularPrecos() {
        const selectedCar = carSelector.value;
        const factor = parseFloat(currentInflationInput.value) || 1; 
        
        popularCategorias(factor); 
        somarCustoTotalAtual(); 
    }
    
    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    
    function popularCarros() {
        carSelector.innerHTML = '<option value="">Selecione um Carro</option>';
        const carKeys = Object.keys(PRECOS_BASE_RAW).sort();
        carKeys.forEach(carName => {
            const option = document.createElement('option');
            option.value = carName;
            option.textContent = carName;
            carSelector.appendChild(option);
        });
        // Garante que o placeholder do seletor de peças apareça se o carro não estiver selecionado
        const placeholder = dynamicPieceSelectors.querySelector('p.placeholder-text');
        if (placeholder) placeholder.style.display = 'block';
        buildPrices = {};
    }
    
    function popularCategorias(factor = 1) {
        const selectedCar = carSelector.value;
        const currentSelections = {};
        dynamicPieceSelectors.querySelectorAll('select').forEach(selector => {
            currentSelections[selector.dataset.category] = selector.value;
        });

        const selectorsContainer = dynamicPieceSelectors;
        selectorsContainer.querySelectorAll('.selection-group, .group-separator, .group-header').forEach(el => el.remove());
        
        const placeholder = selectorsContainer.querySelector('p.placeholder-text');
        if (placeholder) placeholder.style.display = 'none';

        const tempBuildPrices = {};

        if (!selectedCar || !PRECOS_BASE_RAW[selectedCar] || Object.keys(PRECOS_BASE_RAW[selectedCar]).length === 0) {
             if (placeholder) {
                 placeholder.textContent = `Selecione um carro acima para ver as opções de peças.`;
                 placeholder.style.display = 'block';
             }
             buildPrices = {};
             return;
        }

        const pieceGroups = PRECOS_BASE_RAW[selectedCar];
        let isFirstGroup = true;

        for (const groupName in pieceGroups) {
            if (!isFirstGroup) {
                const separator = document.createElement('div');
                separator.className = 'group-separator';
                selectorsContainer.appendChild(separator);
            }
            isFirstGroup = false;

            const groupTitle = document.createElement('h3');
            groupTitle.className = 'group-header';
            let groupIcon = '🛠️';
            if (groupName.toLowerCase().includes('motor')) groupIcon = '🔥';
            else if (groupName.toLowerCase().includes('turbo')) groupIcon = '💨';
            else if (groupName.toLowerCase().includes('transmissão')) groupIcon = '⚙️';
            else if (groupName.toLowerCase().includes('suspensão')) groupIcon = '🛞';
            else if (groupName.toLowerCase().includes('estética')) groupIcon = '✨';

            groupTitle.innerHTML = `${groupIcon} ${groupName}`;
            selectorsContainer.appendChild(groupTitle);


            const categoriesInGroup = pieceGroups[groupName];
            
            for (const categoryName in categoriesInGroup) {

                const pecasData = categoriesInGroup[categoryName];
                const groupDiv = document.createElement('div');
                groupDiv.className = 'selection-group input-group';

                const label = document.createElement('label');
                label.htmlFor = `select_${categoryName.replace(/\s/g, '')}`;
                
                const titleSpan = document.createElement('span');
                titleSpan.className = 'category-title';
                
                const categoryDisplay = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
                let exampleText = Object.keys(pecasData)[0] || 'Item';
                const iconText = `${groupIcon} ${categoryDisplay}`; 
                
                titleSpan.textContent = iconText;
                label.appendChild(titleSpan);
                groupDiv.appendChild(label);
                
                const selector = document.createElement('select');
                selector.id = `select_${categoryName.replace(/\s/g, '')}`;
                selector.dataset.category = categoryName;

                const placeholderOption = document.createElement('option');
                placeholderOption.value = "";
                placeholderOption.textContent = `Selecione a peça desejada (Ex: ${exampleText.charAt(0).toUpperCase() + exampleText.slice(1)})`;
                selector.appendChild(placeholderOption);
                
                for (const pecaName in pecasData) {
                    const option = document.createElement('option');
                    option.value = pecaName;
                    const precoBase = pecasData[pecaName];
                    const precoFinal = precoBase * factor;
                    option.textContent = pecaName; 
                    option.dataset.price = precoFinal.toString();
                    selector.appendChild(option);

                    if (pecaName === currentSelections[categoryName]) {
                        option.selected = true;
                        tempBuildPrices[categoryName] = precoFinal;
                    }
                }
                
                selector.addEventListener('change', (event) => {
                    const selectedOption = event.target.options[event.target.selectedIndex];
                    const category = event.target.dataset.category;
                    
                    if (selectedOption && selectedOption.dataset.price) {
                        buildPrices[category] = parseFloat(selectedOption.dataset.price); 
                    } else {
                        buildPrices[category] = 0;
                    }
                    somarCustoTotalAtual(); 
                });

                groupDiv.appendChild(selector);
                selectorsContainer.appendChild(groupDiv);
            } 
        } 
        
        buildPrices = tempBuildPrices; 
    }

    // --- FUNÇÃO DE RESET ---
    function resetAllInputs() {
        // 1. Resetar inputs e seletor
        currentInflationInput.value = "1.05";
        contractValueInput.value = "";
        carValueInput.value = "";
        carSelector.value = ""; 
        
        // 2. Limpar preços e recalcular (o fluxo recalcula tudo e limpa o display)
        buildPrices = {};
        recalcularEPopularPrecos(); 
        
        // 3. Colocar o foco no primeiro campo para facilidade do usuário
        contractValueInput.focus();
    }

    // --- INICIALIZAÇÃO E LISTENERS DE EVENTO ---

    popularCarros();
    recalcularEPopularPrecos(); 

    // Apenas recalcula a soma (não redesenha peças)
    contractValueInput.addEventListener('input', somarCustoTotalAtual); 
    carValueInput.addEventListener('input', somarCustoTotalAtual);      

    // Recalcula e Repopula Peças
    currentInflationInput.addEventListener('input', recalcularEPopularPrecos);
    carSelector.addEventListener('change', recalcularEPopularPrecos); 
    calculateBtn.addEventListener('click', recalcularEPopularPrecos);
    
    // Listener para o novo botão de reset
    resetContractBtn.addEventListener('click', resetAllInputs);
});