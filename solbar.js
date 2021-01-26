/**
 * @namespace
 * @name create the root namespace and making sure we're not overwriting it
 * @memberof! <global>
 */
var createNS = createNS || function namespace(namespace) {
	var object = this, tokens = namespace.split("."), token;
	while (tokens.length > 0) {
		token = tokens.shift();
		if (typeof object[token] === "undefined") {
			object[token] = {};
		}
		object = object[token];
	}
	return object;
};

var solbar = createNS("solbar");

////////////////////////////////////////////////////////////////////////////
// START                                                                  //
////////////////////////////////////////////////////////////////////////////
solbar.KEY_PROJECT_CD 	= "PROJECT_CD";
solbar.KEY_USE_YN 		= "USE_YN";

solbar.codeSelPopUrl = "scm::scmSelPopUp.xfdl";
solbar.sKeySearchText = "SEARCH_TEXT";		//DB의 검색어 키값

/**
 * callback : 함수를 실행하여 값을 전달하고 return 값을 넘겨준다
 */
solbar.callback = function(objForm, sCallback, oRtn, oRtn2, oRtn3)
{
	var retValue;
	if(!take.isNull(objForm) && !take.isNull(sCallback)){
		try {
			if (typeof sCallback == "function") {
				retValue = sCallback.call(objForm, oRtn, oRtn2, oRtn3);
			} 
			else if(typeof sCallback == "string") {
				if (!take.isFunction(objForm[sCallback])){
					return retValue;
				} 
				else {
					retValue = objForm[sCallback].call(objForm, oRtn, oRtn2, oRtn3);
				}
			}
		} 
		catch(e) {
			console.dir(e);
		}
	}
	return retValue;
};

/**
 * getColonValue : key:value 형태에서 value 값 변경
 * @param  {String} sColonValue 콜론으로 구분된 값
 * @param  {String} sValue 	콜론 다음에 추가할 값
 * @return {String} 콜론으로 구분된 변경된 값
 * @example solbar.getColonValue("key:value", "value2"); => "key:value2"
 */
solbar.getColonValue = function(sColonValue, sValue)
{	
	var sResetValue = sValue;
	var nColonIndex = sColonValue.indexOf(':');
	if (nColonIndex >= 0) {
		sResetValue = sColonValue.substring(0, nColonIndex) + ":" + sValue;
	}
	return sResetValue;
};

/**
 * isUnuseComp : 해당항목의 사용여부를 판단
 * @param  {String} sCompKey 사용항목 Key
 * @return {boolean} 해당항목의 미사용여부
 * @example solbar.isUnuseComp("prdt_color"); => true
 */
solbar.isUnuseComp = function(sCompKey)
{	
	//서버에서 미사용여부 못받아왔으면 사용하는걸로 본다
	return !take.isNull(nexacro.getApplication().av_mapUnuseComp) ? nexacro.getApplication().av_mapUnuseComp.has(sCompKey) : true;
};
/**
 * isUseComp : 해당항목의 사용여부를 판단
 * @param  {String} sCompKey 사용항목 Key
 * @return {boolean} 해당항목의 사용여부
 * @example solbar.isUseComp("prdt_color"); => true
 */
solbar.isUseComp = function(sCompKey)
{	
	return !solbar.isUnuseComp(sCompKey);
};

/**
 * getProjectParam : 프로젝트코드를 파라미터로 조합
 * @return {String} 프로젝트코드를 파라미터로 조합
 * @example solbar.getProjectParam(); => "PROJECT_CD=12345"
 */
solbar.getProjectParam = function()
{	
	return solbar.KEY_PROJECT_CD + "=" + nexacro.getApplication().av_sProjectCd;

// 	return {
// 		PROJECT_CD	: nexacro.getApplication().av_sProjectCd
// 	};
};

/**
 * addParam : key=value 형태로 return
 * @param  {String} sKey 	파라미터 Key값
 * @param  {String} sValue 	파라미터 value값
 * @return {String} sKey=sValue
 * @example solbar.getParam("key", "value"); => "key=value"
 */
solbar.getParam = function(sKey, sValue)
{	
	return sKey + "=" + sValue;
};

/**
 * addParam : key1=value1 key2=value2 형태로 추가
 * @param  {String} sSrcParam source 파라미터
 * @param  {String} sKey 	파라미터 Key값
 * @param  {String} sValue 	파라미터 value값
 * @return {String} key1=value1 sKey=sValue
 * @example solbar.addParam("key1=value1", "key2", "value2"); => "key1=value1 key2=value2"
 */
solbar.addParam = function(sSrcParam, sKey, sValue)
{	
	return ((take.nvl(sSrcParam, "") == "") ? "" : (sSrcParam + " ")) + solbar.getParam(sKey, sValue);
};

/**
 * dataset2Object : dataset 특정행을 object로 변환
 */
solbar.dataset2Object = function(dsObj, nRow)
{
	var rtnObj	= {};
	
	for (var i = 0; i < dsObj.getColCount(); i++)
	{
		var strColId	 = dsObj.getColID(i);
		rtnObj[strColId] = dsObj.getColumn(nRow, strColId);
	}
	
	return rtnObj;
};


/**
 * 공통 데이터 팝업
 * @param  {Object}  pThis       nexacro form object
 * @param  {String}  sPopId      팝업아이디
 * @param  {String}  sTitle      팝업타이틀
 * @param  {String}  sTxt        검색어
 * @param  {Object}  objDs       데이터셋
 * @param  {String}  sNameSpace  네임스페이스
 * @param  {Object}  objDsIn     검색조건 데이터셋
 * @param  {String}  sParam      파라미터 [key=value] : "PROJECT_CD=PM00000001 WH_CD=WH00000002"
 * @param  {Array}   arrColInfo  대상 컬럼 배열  (컬럼id, 컬럼명, 컬럼 사이즈)
 * @param  {Boolean} bMulti      멀티 선택 여부
 * @param  {String}  sCallBack   완료후 실행할 CallBack 함수
 * @return {Function} CallBack Function
 * @example solbar.dataSelPopUp(this, "test", "테스트팝업", "테스트", this.dsCode, "", null, "", [["Column1", "컬럼이번", "30"],["Column0", "컬럼일번", "20"]], true, "fnCallBack");
 */
solbar.dataSelPopUp = function(pThis, sPopId, sTitle, sTxt, objDs, sNameSpace, objDsIn, sParam, arrColInfo, bMulti, sCallBack)
{
	/**
	take.objCallBack[pThis.name+"_popup_"+sPopId] = "";
	take.objCallBack[pThis.name+"_popup"] = "";

	if (take.nvl(sCallBack, "")!="")
	{
		if (take.isFunction(sCallBack))
		{
			//최종 폼에서 처리할 콜백함수를 변수에 담는다.
			take.objCallBack[pThis.name+"_popup_"+sPopId] = sCallBack;

		} else {
			//최종 폼에서 처리할 콜백함수를 변수에 담는다.
			take.objCallBack[pThis.name+"_popup"] = sCallBack;
		}
	}
	**/
	take.debug(pThis.name + ".solbar.dataSelPopUp", "simpleSelPopUp(" + sPopId + ") 팝업 호출");

	//PopUpOpen
	take.openPopup(pThis, sPopId, solbar.codeSelPopUrl, 
					{Title:sTitle, Text:sTxt, Dataset: objDs, NameSpace: sNameSpace, InDataset: objDsIn, Param: sParam, ColInfo:arrColInfo, Multi:bMulti, CallBack:sCallBack}, 
					"showtitlebar=true layered=false", 
					function(sId, sRtn) {}, false);
}

solbar.fnTest= function(pThis){
	pThis.alert('solbar js test');
};

////////////////////////////////////////////////////////////////////////////
// END                                                                    //
////////////////////////////////////////////////////////////////////////////
