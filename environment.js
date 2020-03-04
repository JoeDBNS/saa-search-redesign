const app_environment = {
    "MiTalentTestApi": "https://test-webapi.mitalent.org/pathfinder/api/Schools?$inlinecount=allpages&$filter=substringof('__SearchVariable__', InstName1)%20eq%20true",
    "SAA_Facility": "https://dev-webapi.wda.state.mi.us/SAA_API/facility/0?nameContain=__SearchVariable__",
    "SAA_Facility_Id": "https://dev-webapi.wda.state.mi.us/SAA_API/facility/__SearchVariable__",
    "SAA_Facility_Programs":  "https://dev-webapi.wda.state.mi.us/SAA_API/program/0?facilityid=__SearchVariable__",
    "SAA_Program": "https://dev-webapi.wda.state.mi.us/SAA_API/program/0?titleContain=__SearchVariable__",
    "SAA_Program_Unique": "https://dev-webapi.wda.state.mi.us/SAA_API/program/unique/__SearchVariable__",
    "SAA_Program_Facilities": "https://dev-webapi.wda.state.mi.us/SAA_API/program/0?titleequal=__SearchVariable__",
}