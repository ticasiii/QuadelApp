import Enum from 'enum'

export const stateEnum = new Enum({'ALARM': 4, 'ERROR': 3, 'OFF': 2, 'OK':1})

stateEnum.translateToStateCode = function(state){
    console.log(stateEnum.get(state).value)
    return stateEnum.get(state).value
}

stateEnum.translateToStateFromCode = function(stateCode){
    console.log(stateEnum.get(stateCode).key)

    return stateEnum.get(stateCode).key
}

stateEnum.translateToStateFromCodeFromNode = function(jSonObj){
    console.log(stateEnum.get(jSonObj.state).key)

    jSonObj.state = stateEnum.get(jSonObj.state).key
}

const stranslateToStateCode = function(state) {
    switch (state) {
        case state.ALARM:
            return 4;
        case state.ERROR:
            return 3;
        case state.OFF:
            return 2;
        case state.OK:
            return 1;            
                
        default:
            return 1;
    }
}


const stranslateToStateFromCode = function (stateCode){
    switch (stateCode) {
        case 4:
            return state.ALARM;
        case 3:
            return state.ERROR;
        case 2:
            return state.OFF;
        case 1:
            return state.OK;            
                
        default:
            return state.OK;
    }
}

//translateToStateCode('ALARM')
//translateToStateFromCode(4)
