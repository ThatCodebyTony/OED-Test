/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
    This file tests the readings retrieval API for charts quantity meters.
    See: https://github.com/OpenEnergyDashboard/DesignDocs/blob/main/testing/testing.md for information.
*/

const { chai, mocha, expect, app } = require('../common');
const { prepareTest,
    parseExpectedCsv,
    expectReadingToEqualExpected,
    getUnitId,
    ETERNITY,
    METER_ID,
    unitDatakWh,
    conversionDatakWh,
    meterDatakWh, 
    // Tony: added the utilties for CO2 below (originally I could not go to Definitions via VS code, but adding the uutilties for CO2 below made it work.
    unitDataCO2, 
    conversionDataCO2, 
    meterDataCO2} = require('../../util/readingsUtils');


mocha.describe('readings API', () => {
    mocha.describe('readings test, test if data returned by API is as expected', () => {
        mocha.describe('for bar charts', () => {
            mocha.describe('for quantity meters', () => {
                // The logic here is effectively the same as the line charts, however bar charts have an added
                // barWidthDays parameter that must be accounted for, which adds a few extra steps
                mocha.it('B1: 1 day bars for 15 minute reading intervals and quantity units with +-inf start/end time & kWh as kWh', async () => {
                    // Load the data into the database
                    await prepareTest(unitDatakWh, conversionDatakWh, meterDatakWh);
                    // Get the unit ID since the DB could use any value.
                    const unitId = await getUnitId('kWh');
                    // Load the expected response data from the corresponding csv file
                    const expected = await parseExpectedCsv('src/server/test/web/readingsData/expected_bar_ri_15_mu_kWh_gu_kWh_st_-inf_et_inf_bd_1.csv');
                    // Create a request to the API for unbounded reading times and save the response
                    const res = await chai.request(app).get(`/api/unitReadings/bar/meters/${METER_ID}`)
                        .query({
                            timeInterval: ETERNITY.toString(),
                            barWidthDays: 1,
                            graphicUnitId: unitId
                        });
                    // Check that the API reading is equal to what it is expected to equal
                    expectReadingToEqualExpected(res, expected);
                });
                mocha.it('B2: 7 day bars for 15 minute reading intervals and quantity units with +-inf start/end time & kWh as kWh', async () => {
                    // Load the data into the database
                    await prepareTest(unitDatakWh, conversionDatakWh, meterDatakWh);
                    // Get the unit ID since the DB could use any value.
                    const unitId = await getUnitId('kWh');
                    // Load the expected response data from the corresponding csv file
                    const expected = await parseExpectedCsv('src/server/test/web/readingsData/expected_bar_ri_15_mu_kWh_gu_kWh_st_-inf_et_inf_bd_7.csv');
                    // Create a request to the API for unbounded reading times and save the response
                    const res = await chai.request(app).get(`/api/unitReadings/bar/meters/${METER_ID}`)
                        .query({
                            timeInterval: ETERNITY.toString(),
                            barWidthDays: 7,
                            graphicUnitId: unitId
                        });
                    // Check that the API reading is equal to what it is expected to equal
                    expectReadingToEqualExpected(res, expected);
                });
                mocha.it('B3: 28 day bars for 15 minute reading intervals and quantity units with +-inf start/end time & kWh as kWh', async () => {
                    // Load the data into the database
                    await prepareTest(unitDatakWh, conversionDatakWh, meterDatakWh);
                    // Get the unit ID since the DB could use any value.
                    const unitId = await getUnitId('kWh');
                    // Load the expected response data from the corresponding csv file
                    const expected = await parseExpectedCsv('src/server/test/web/readingsData/expected_bar_ri_15_mu_kWh_gu_kWh_st_-inf_et_inf_bd_28.csv');
                    // Create a request to the API for unbounded reading times and save the response
                    const res = await chai.request(app).get(`/api/unitReadings/bar/meters/${METER_ID}`)
                        .query({
                            timeInterval: ETERNITY.toString(),
                            barWidthDays: 28,
                            graphicUnitId: unitId
                        });
                    // Check that the API reading is equal to what it is expected to equal
                    expectReadingToEqualExpected(res, expected);
                });
                mocha.it('B4: 13 day bars for 15 minute reading intervals and quantity units with +-inf start/end time & kWh as kWh', async () => {
                    // Load the data into the database
                    await prepareTest(unitDatakWh, conversionDatakWh, meterDatakWh);
                    // Get the unit ID since the DB could use any value.
                    const unitId = await getUnitId('kWh');
                    // Load the expected response data from the corresponding csv file
                    const expected = await parseExpectedCsv('src/server/test/web/readingsData/expected_bar_ri_15_mu_kWh_gu_kWh_st_-inf_et_inf_bd_13.csv');
                    // Create a request to the API for unbounded reading times and save the response
                    const res = await chai.request(app).get(`/api/unitReadings/bar/meters/${METER_ID}`)
                        .query({
                            timeInterval: ETERNITY.toString(),
                            barWidthDays: 13,
                            graphicUnitId: unitId
                        });
                    // Check that the API reading is equal to what it is expected to equal
                    expectReadingToEqualExpected(res, expected);
                });

                // Add B5 here

                // Add B6 here

                // Add B7 here

                // Add B8 here

                // Add B9 here

                // Add B10 here

                // Add B11 here

                // Add B12 here

                // Tony: Copied the previous tests (B1, B2, B3, B4) and adjusted parameters to test for B12.
                // Tony: Changed the path of "const expected = await parseExpectedCsv" to the B12 csv file.
                // Tony: Changed mocha.it to describe the time interval, period, and "graphic unit" being tested.
                    // Tony: While B1-to-B4 test for kWh as kWh, B12 tests for kg of CO₂.
                    // Tony: B1-to-B4's line "const unitId = await getUnitId('kWh');", I changed it to "const unitId = await getUnitId('kgCO2');" for B12 at line 124.
                        // Tony ISSUE: I don't know that is correct.
                // Tony: "barWidthDays:" for B1-to-B4 seems to reflect the amount of days, so I put 75 for B12.
                // Arthur: I think the "barWidthDays:" should be 1, if you look on the testing.md doc for B12, the description states 1 day bars for 15 minute intervals
                // Arthur: If you go to test B1-B4 you can see the barWidthDays values correspond with the number stated in each of the descriptions 
                
                mocha.it('B12: 1 day bars for 15 minute reading intervals and quantity units with +-inf start/end time & kWh as kg of CO2', async () => {
                    const unitData = [
                        {
                            // u2
                            name: 'Electric_Utility',
                            identifier: '',
                            unitRepresent: Unit.unitRepresentType.QUANTITY,
                            secInRate: 3600,
                            typeOfUnit: Unit.unitType.METER,
                            suffix: '',
                            displayable: Unit.displayableType.NONE,
                            preferredDisplay: false,
                            note: 'special unit'
                        },
                        {
                            // u10
                            name: 'kg',
                            identifier: '',
                            unitRepresent: Unit.unitRepresentType.QUANTITY,
                            secInRate: 3600,
                            typeOfUnit: Unit.unitType.UNIT,
                            suffix: '',
                            displayable: Unit.displayableType.ALL,
                            preferredDisplay: false,
                            note: 'OED created standard unit'
                        },
                        {
                            // u11
                            name: 'metric ton',
                            identifier: '',
                            unitRepresent: Unit.unitRepresentType.QUANTITY,
                            secInRate: 3600,
                            typeOfUnit: Unit.unitType.UNIT,
                            suffix: '',
                            displayable: Unit.displayableType.ALL,
                            preferredDisplay: false,
                            note: 'OED created standard unit'
                        },
                        {
                            // u12
                            name: 'kg CO₂',
                            identifier: '',
                            unitRepresent: Unit.unitRepresentType.QUANTITY,
                            secInRate: 3600,
                            typeOfUnit: Unit.unitType.UNIT,
                            suffix: 'CO₂',
                            displayable: Unit.displayableType.ALL,
                            preferredDisplay: false,
                            note: 'special unit'
                        }
                    ];
                    const conversionData = [
                        {
                            // c11
                            sourceName: 'Electric_Utility',
                            destinationName: 'kg CO₂',
                            bidirectional: false,
                            slope: 0.709,
                            intercept: 0,
                            note: 'Electric_Utility → kg CO₂'
                        },
                        {
                            // c12
                            sourceName: 'kg CO₂',
                            destinationName: 'kg',
                            bidirectional: false,
                            slope: 1,
                            intercept: 0,
                            note: 'CO₂ → kg'
                        }
                    ];
                    const meterData = [
                        {
                            name: 'Electric_Utility kg of CO₂',
                            unit: 'Electric_Utility',
                            displayable: true,
                            gps: undefined,
                            note: 'special meter',
                            file: 'test/web/readingsData/readings_ri_15_days_75.csv',
                            deleteFile: false,
                            readingFrequency: '15 minutes',
                            id: METER_ID
                        }
                    ];
                    await prepareTest(unitData, conversionData, meterData); 																	     
                    // Get the unit ID since the DB could use any value.
                    const unitId = await getUnitId('kg of CO₂');
                    // Load the expected response data from the corresponding csv file
                    // Load the expected response data from the corresponding csv file
                    const expected = await parseExpectedCsv('src/server/test/web/readingsData/expected_bar_ri_15_mu_kWh_gu_kgCO2_st_-inf_et_inf_bd_1.csv');
                    // Create a request to the API with specific parameters for B12 and save the response
                    const res = await chai.request(app).get(`/api/unitReadings/bar/meters/${METER_ID}`)
                        .query({
                            timeInterval: ETERNITY.toString(), // Replace with the specific time interval for B12
                            barWidthDays: 1, // Replace with the specific bar width for B12
                            graphicUnitId: unitId
                        });
                    // Check that the API reading is equal to what it is expected to equal
                    expectReadingToEqualExpected(res, expected);
                });
                

                
                // Add B13 here

                // Add B14 here

            });
        });
    });
});
