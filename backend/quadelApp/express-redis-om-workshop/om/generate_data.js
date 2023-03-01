const STARTING_TIMESTAMP = new Date('2022-10-01T00:00:00.000Z').getTime();
const TOTAL_DAYS = 0.05//199; // days between 1.7.2022. and 15.1.2023.
const TOTAL_TIMESTAMPS_PER_ELEMENT = TOTAL_DAYS * 24 * 60 * 60 / 5
const NUMBER_OF_ALARMS_BEFORE_OFF = 100;

const FIVE_SECONDS_IN_MILLISECONDS = 5000;

import { createClient  } from 'redis';
const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

const getRandomNumberInRange = (minValue, maxValue) => {
	const randomNumber = Math.floor(Math.random() * (maxValue - minValue)) + minValue; // random value between minValue and maxValue
	return randomNumber;
};


const changeMiliseconds = timestamp => {
	const newMiliseconds = getRandomNumberInRange(0, 999);
	timestamp = Math.floor(timestamp / 1000) * 1000 + newMiliseconds;
	return timestamp;
};

const getNextTime = prevTimestamp => {
	return prevTimestamp + FIVE_SECONDS_IN_MILLISECONDS;	
};


const getRandomFlag = (threashold, factor) => {
	const value = Math.random() * factor;
	if (value < threashold) {
		return true;
	}
	return false;
};

const getIsAlarm = () => {
	return getRandomFlag(63, 100000000);
};

const getIsFault = () => {
	return getRandomFlag(63, 100000000);
};

const getIsOftenAlarm = () => {
	return getRandomFlag(24, 100000);
};

const createOneRecord = (timestamp, elementId, state) => {
	const fs = require('fs');
	const record = `{"timestamp": ${timestamp}, "elementId": ${elementId}, "state": ${state}}`;
	fs.appendFileSync('data.txt', `${record}\n`, err => {
  		if (err) {
		    console.error(err);
		}
	});

}

import { elementIdByCentralId  as elementIdsByCentralId } from './getElementsByCentral.js';
import { OFTEN_ELEMENTS as oftenElements } from './getElementsByCentral.js';
import { SOMETIMES_ELEMENTS as sometimesElements } from './getElementsByCentral.js';


const numberOfAlarmsByOftenElementId = {};
oftenElements.forEach(el => {
	numberOfAlarmsByOftenElementId[el] = NUMBER_OF_ALARMS_BEFORE_OFF;
});

const createRecordsForAllElements =  (currentTimestamp, offElementIds, faultElementId, alarmElementId, oftenAlarmElementId) =>  {
	let state = 1;
	let timestamp = changeMiliseconds(currentTimestamp);

	for (let elementIds of Object.values(elementIdsByCentralId)) {
		elementIds.forEach(elementId => {
			if (offElementIds.includes(elementId)) {
				state = 2;
			} else if (elementId === faultElementId) {
				state = 3;
			} else if (elementId === alarmElementId || elementId === oftenAlarmElementId) {
				state = 4;
			}
            client.ts.ADD(String(elementId), timestamp, state);
		});
	}
};

export const deleteAllKeys = () =>{
    for (const [centralId, elementIds] of Object.entries(elementIdsByCentralId)) {
		elementIds.forEach(async elementId => {
            console.log("ElementID: "+elementId);
       
            await client.DEL(String(elementId));
		});
	}
}

export const generate_data = (startingOffset) => {//dodat parametar startingOffset
	let i = 0;

	let isOftenAlarm = false;
	let numberOfOftenAlarmTimestamps = 0;
	let oftenAlarmElementId = null;
	
	let isAlarm = false;
	let numberOfAlarmTimestamps = 0;
	let alarmElementId = null;

	let isFault = false;
	let numberOfFaultTimestamps = 0;
	let faultElementId = null;
	
	let startingTimestamp = STARTING_TIMESTAMP + startingOffset * 24 * 60 * 60 * 1000//this is new

	const offElementIds = [];
	//let currentTimestamp = STARTING_TIMESTAMP;		this is old
	let currentTimestamp = startingTimestamp;//			this is new
	while (i < TOTAL_TIMESTAMPS_PER_ELEMENT) {
		i++;
		if (isOftenAlarm) {
			if (numberOfOftenAlarmTimestamps > 0) {
				numberOfOftenAlarmTimestamps -= 1;
			} else {
				if (numberOfAlarmsByOftenElementId[oftenAlarmElementId] === 0) {
					offElementIds.push(oftenAlarmElementId);
				}
				oftenAlarmElementId = null;
				isOftenAlarm = false;
			}
		} else {
			isOftenAlarm = getIsOftenAlarm();
			if (isOftenAlarm) {
				numberOfOftenAlarmTimestamps = getRandomNumberInRange(60, 270);
				const oftenAlarmElementIndex = getRandomNumberInRange(0, oftenElements.length - 1);
				oftenAlarmElementId = oftenElements[oftenAlarmElementIndex];
				const numberOfRemainingAlarms = numberOfAlarmsByOftenElementId[oftenAlarmElementId];
				if (numberOfRemainingAlarms === 1) {
					oftenElements.splice(oftenAlarmElementIndex, 1);
				}
				numberOfAlarmsByOftenElementId[oftenAlarmElementId] -= 1;
			}
		}
		if (isAlarm) {
			if (numberOfAlarmTimestamps > 0) {
				numberOfAlarmTimestamps -= 1;
			} else {
				alarmElementId = null;
				isAlarm = false;
			}
		} else {
			isAlarm = getIsAlarm();
			if (isAlarm) {
				numberOfAlarmTimestamps = getRandomNumberInRange(60, 270);
				const alarmElementIndex = getRandomNumberInRange(0, 199);
				alarmElementId = sometimesElements[alarmElementIndex];
			}
		}
		if (isFault) {
			if (numberOfFaultTimestamps > 0) {
				numberOfFaultTimestamps -= 1;
			} else {
				faultElementId = null;
				isFault = false;
			}
		} else {
			isFault = getIsFault();
			if (isFault) {
				numberOfFaultTimestamps = getRandomNumberInRange(43200, 86400);
				faultElementId = getRandomNumberInRange(27, 1529);
			}
		}
		currentTimestamp = getNextTime(currentTimestamp);
		createRecordsForAllElements(currentTimestamp, offElementIds, faultElementId, alarmElementId, oftenAlarmElementId)
	}

};



//generate_data();