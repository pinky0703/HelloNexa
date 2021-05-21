/**
*  코드관리
* 
*  @MenuPath    기초관리 > 품목관리
*  @FileName    sbaPrdtMgr.xfdl 
*  @Creator     전명호
*  @CreateDate  2021.04.26 
*  @Version     1.0
*  @Desction    품목 조회 등록 수정
* 
************** 소스 수정 이력 *************************************************
*    date          Modifier            Description
*******************************************************************************
*  2021.04.26      전명호             최초 생성 
*******************************************************************************
*/

//공통 라이브러리 호출

/*********************************************************
 * 1.1 FORM 변수 선언 영역
 ********************************************************/
const APP = nexacro.getApplication();
var CODE_Y = "Y";
var CODE_N = "N";
const ARR_STA_STANDARD = [this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard1,
						  this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard2,
						  this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard3,
						  this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard4,
						  this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard5];

//this.fv_nFormVal = null;     //용도
this.fv_sProjectCd = nexacro.getApplication().av_sProjectCd;
this.fv_sPrdtImage = this.tabPrdt.tabpBasic.form.divPrdtImage.form.ivPrdtImage.image;
var tabp = this.tabPrdt.tabpBasic.form;
var div = tabp;
//var div = this.tabPrdt.tabpBasic.form.divBusiness.form;

/*********************************************************
* 1.2 FORM EVENT 영역(onload)
********************************************************/
this.take_oninit = function(obj:nexacro.Form,e:nexacro.EventInfo)
{
	if ((this.parent.parent !== undefined) && (this.parent.parent.isPopUp)) {
		this.tabInfo.set_visible(false);
		this.tabInfo.set_height(0);
		//1032, 590
		this.set_height(590);
		this.tabSearch.set_bottom(0);
		this.resetScroll();
	}
};
/**
* formid_onload 최초 로드시 발생되는 이벤트 (필수)
*/
this.take_onload = function(obj:Form, e:nexacro.LoadEventInfo)
{
   if (take.formOnLoad(this)) //공통 온로드(필수) : 최초 온로드시 공통으로 호출되는 함수 --> 필수
   {
		if (APP.gdsUseYnCode.rowcount > 0) {
			CODE_Y = APP.gdsUseYnCode.getColumn(0, "CODE");
			CODE_N = APP.gdsUseYnCode.getColumn(1, "CODE");

			//5개 규격별 타이틀에 데이터셋 할당
			this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard1.standardDataset = this.dsStandard1;
			this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard2.standardDataset = this.dsStandard2;
			this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard3.standardDataset = this.dsStandard3;
			this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard4.standardDataset = this.dsStandard4;
			this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard5.standardDataset = this.dsStandard5;

			this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard1.standardCbo = this.tabPrdt.tabpBasic.form.divPrdtStandard.form.cboPrdtStandard1;
			this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard2.standardCbo = this.tabPrdt.tabpBasic.form.divPrdtStandard.form.cboPrdtStandard2;
			this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard3.standardCbo = this.tabPrdt.tabpBasic.form.divPrdtStandard.form.cboPrdtStandard3;
			this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard4.standardCbo = this.tabPrdt.tabpBasic.form.divPrdtStandard.form.cboPrdtStandard4;
			this.tabPrdt.tabpBasic.form.divPrdtStandard.form.staPrdtStandard5.standardCbo = this.tabPrdt.tabpBasic.form.divPrdtStandard.form.cboPrdtStandard5;
		}
//trace(this, "### fnCommonCode!!!");
		this.fnCommonCode();
	}
};

this.fnCommonCode = function()
{
	//공통코드
    var sOutDs      = ["dsPrdtType","dsPrdtUnit",	"dsBoxUnit","dsSerialCodeType",	"dsLotNoType",	"dsWarranty",	"dsShelfLife"];
    var sGroupCodes = ["00053",		"00034",		"00035",	"00057",			"00058",		"00055",		"00056"];
    var sHeaderType = ["", 			"", 			"",			"",					"",				"",				""];
	//프로젝트별 공통코드
	var sProjectOutDs      = [];
    var sProjectGroupCodes = [];
    var sProjectHeaderType = [];		// "SEL" : 선택 표시

	//일반 테이블 : 서버와 동시에 수정
	var sAddParam = "prdtGroupCodeSearch=dsPrdtGroupL prdtGroupStandardSelect=dsPrdtGroupStandard prdtStandardCodeSelect=dsStandardGroup";

//trace(this, "### solbar.tranProjectCode.sGroupCodes : " + sGroupCodes);
    solbar.tranProjectCode
	(
        this, 
        sGroupCodes, 
        sOutDs, 
        sHeaderType,
        sProjectGroupCodes, 
        sProjectOutDs, 
        sProjectHeaderType,
		sAddParam,
        function(sId, nErrCd, sErrMsg)
        {
			//품목그룹
//trace(this, "### dsPrdtGroupL.rowcount : " + this.dsPrdtGroupL.rowcount);
//            for (var n = 0; n < this.dsPrdtGroupL.rowcount; n++) {
//trace(this, "### dsPrdtGroupL [" + n + "] " + this.dsPrdtGroupL.getColumn(n, "PCODE") + ", " + this.dsPrdtGroupL.getColumn(n, "CODE") + ", " + this.dsPrdtGroupL.getColumn(n, "NAME"));
//			}
			this.dsPrdtGroupL.filter();
			var sFilter = "PCODE.toString().indexOf('00000000') == 0";
			this.dsPrdtGroupL.filter(sFilter);
			
			if (this.dsPrdtGroupM.rowcount < 1) {
				this.dsPrdtGroupM.copyData(this.dsPrdtGroupL, false);
				this.dsPrdtGroupS.copyData(this.dsPrdtGroupL, false);
			}

			//규격
			//품목소그룹별 규격 1~5
//			for (var n = 0; n < this.dsPrdtGroupStandard.rowcount; n++) {
// trace(this, "### dsPrdtGroupStandard [" + n + "] " + 
// 				this.dsPrdtGroupStandard.getColumn(n, "GROUP_ID") + ", " + 
// 				this.dsPrdtGroupStandard.getColumn(n, "PRDT_GROUP_ID") + ", " + 
// 				this.dsPrdtGroupStandard.getColumn(n, "PRDT_STANDARD_GROUP_ID1") + ", " + 
// 				this.dsPrdtGroupStandard.getColumn(n, "PRDT_STANDARD_ID1") + ", " + 
// 				this.dsPrdtGroupStandard.getColumn(n, "PRDT_STANDARD_NM1"));
//			}

			//품목 그룹별 규격 설정 : fnInitMenu() 에서 초기화
			//this.fnSetPrdtGroupStandard(this.dsPrdtGroupStandard.getColumn(0, "GROUP_ID"), this.dsPrdtGroupStandard.getColumn(0, "PRDT_GROUP_ID"));
			
			this.fnInitMenu();

			this.fnTran('PrdtList');
			this.fnTran('PrdtIdSelect');
        },
		false
	);
};

this.fnSetPrdtGroupStandard = function(sGroupId, sPrdtGroupId)
{
	var pcode;
	var ccode;
	for (var i = 0; i < ARR_STA_STANDARD.length; i++) {
		ARR_STA_STANDARD[i].set_visible(false);
		ARR_STA_STANDARD[i].standardCbo.set_visible(false);
	}
	for (var n = 0; n < this.dsPrdtGroupStandard.rowcount; n++) {
//trace(this, "### dsPrdtGroupStandard [" + n + "] " + this.dsPrdtGroupStandard.getColumn(n, "GROUP_ID") + ", " + this.dsPrdtGroupStandard.getColumn(n, "PRDT_GROUP_ID"))
		//소분류의 코드가 같은 dsPrdtGroupStandard을 찾는다
		if ((this.dsPrdtGroupStandard.getColumn(n, "GROUP_ID") 		== sGroupId) &&
			(this.dsPrdtGroupStandard.getColumn(n, "PRDT_GROUP_ID")	== sPrdtGroupId)) {
			//5개 규격이 각각 있으면 해당 설정 세팅
			for (var i = 0; i < ARR_STA_STANDARD.length; i++) {
				var nIdx = i + 1;
				pcode = take.nvl(this.dsPrdtGroupStandard.getColumn(n, "PRDT_STANDARD_GROUP_ID" + nIdx), "");
				if (pcode != "") {
					//소분류의 코드가 같은 dsPrdtGroupStandard의 규격을 찾는다
					ccode = this.dsPrdtGroupStandard.getColumn(n, "PRDT_STANDARD_ID" + nIdx);

					//규격별 이름과 코드 할당
					this.dsStandardGroup.filter();
					sFilter = "PCODE.toString().indexOf('" + pcode + "') == 0 && CODE.toString().indexOf('" + ccode + "') == 0";
					this.dsStandardGroup.filter(sFilter);
					ARR_STA_STANDARD[i].set_text(this.dsStandardGroup.getColumn(0, "NAME"));
					ARR_STA_STANDARD[i].standardCode = ccode;

					//규격별 데이터셋 할당
					this.dsStandardGroup.filter();
					sFilter = "PCODE.toString().indexOf('" + ccode + "0000') == 0";
					this.dsStandardGroup.filter(sFilter);
					ARR_STA_STANDARD[i].standardDataset.copyData(this.dsStandardGroup, true);
					
					ARR_STA_STANDARD[i].set_visible(true);
					ARR_STA_STANDARD[i].standardCbo.set_visible(true);
//trace(this, "### ARR_STA_STANDARD [" + i + "] " + ARR_STA_STANDARD[i].text + ", " + sPrdtGroupId)
				}
			}
			break;
		}
	}
	
	//규격명 가져오기 원위치
	this.dsStandardGroup.filter();
	sFilter = "PCODE.toString().indexOf('00000000') == 0";
	this.dsStandardGroup.filter(sFilter);
}
/*********************************************************
* 2.1 TRANSACTION 서비스 호출 처리
 ********************************************************/
/**
 * fnTran : 조회 transaction (필수) --> 공통 조회에서 호출할 디폴트값 세팅 필요
 * @param  {String} sTranId 트랜젝션 아이디
 * @return {N/A}    N/A
 * @example this.fnTran("ID");
 */
this.fnTran = function(sTranId)
{
    //공통 조회에서 호출할 디폴트값 세팅 필요
    if (take.nvl(sTranId, "")=="") sTranId = "PrdtList";
    
    //변수선언
    var sUrl   = "",      //서비스 URL
        sInDs  = "",      //데이터셋을 검색조건으로 보낼경우 사용 -->선택
        sOutDs = "",      //데이터를 받아올 데이터셋 지정
        sParam = solbar.getProjectParam(),      //파라메터 사용 안 할 경우       
        sCallBack = "fnCallback";        //콜백 처리 함수
    
    switch(sTranId)
    {
        case "PrdtList" :  
			this.dsPrdtList.clearData();
			var sSearchText = take.nvl(this.tabSearch.tabSearchBasic.form.divSearch.form.edtSearch.value, "");
			sParam = solbar.addParam(sParam, "USE_YN", this.tabSearch.tabSearchBasic.form.divSearch.form.cboUseYn.value);
			if (sSearchText != "")
				sParam = solbar.addParam(sParam, "SEARCH_TEXT", sSearchText);
			take.tranSelect(this, "PrdtList", "Prdt.prdtInfoListSearch", "", "dsPrdtList", sParam, sCallBack);
			break;
			
        case "PrdtSelect":
			this.dsPrdtInfo.clearData();
			this.dsPrdtSetList.clearData();
			
			if (take.nvl(this.dsPrdtList.userrow,"")!="")
			{
				this.dsPrdtList.set_rowposition(this.dsPrdtList.userrow);
				this.dsPrdtList.userrow = "";
			}
			
            var sPrdtId = this.dsPrdtList.getColumn(this.dsPrdtList.rowposition, "PRDT_ID");
            var sSetYn = this.dsPrdtList.getColumn(this.dsPrdtList.rowposition, "SET_YN");
			sParam = solbar.addParam(sParam, "PRDT_ID", sPrdtId);
			sParam = solbar.addParam(sParam, "PARENT_PRDT_ID", sPrdtId);
			sParam = solbar.addParam(sParam, "SET_YN", sSetYn);
			
			take.transaction(this, sTranId, "SVC_LOC::prdt/select.do", "", "dsPrdtInfo=dsPrdtInfo dsPrdtSetList=dsPrdtSetList", sParam, sCallBack);
// 			take.tranSelect
// 			(
//                 this, 
//                 sTranId, 
//                 "Prdt.prdtInfoDetail", 
//                 "", 
//                 "dsPrdtInfo=dsPrdtInfo dsPrdtSetList=dsPrdtSetList", 
//                 sParam, 
//                 //"sUserCd=" + sCustCd, 
//                 sCallBack
// 			);
            break;

		case "PrdtIdSelect" :  
			this.dsPrdtId.clearData();
            var sPrdtId = this.dsPrdtList.getColumn(this.dsPrdtList.rowposition, "PRDT_ID");
			sParam = solbar.addParam(sParam, "PRDT_ID", sPrdtId);
			take.tranSelect(this, "PrdtIdSelect", "Prdt.getPrdtId", "", "dsPrdtId", sParam, sCallBack);
            break;
		
		case "PrdtSave" :
            var sPrdtId = this.dsPrdtInfo.getColumn(0, "PRDT_ID");
			sParam = solbar.addParam(sParam, "PRDT_ID", sPrdtId);
			take.transaction(this, 
							"PrdtSave", 
							"SVC_LOC::prdt/save.do", 
							"dsPrdtInfo=dsPrdtInfo:U dsPrdtSetList=dsPrdtSetList:U dsPrdtPrice=dsPrdtPrice:U dsFile=dsFile:U", 
							"", 
							sParam, 
							sCallBack);
            break;
        
		default :
            break;
    }
};

/*********************************************************
 * 2.2 CALLBACK 콜백 처리부분
 ********************************************************/
/**
* fnCallback : transaction callback
* @param  : svcId   - 서비스 아이디 (공통 콜백에서 넘어옴)
* @param  : errCd   - 에러코드 (공통 콜백에서 넘어옴)
* @param  : errMsg   - 에러메세지 (공통 콜백에서 넘어옴)
* @return : N/A
* @example :  
*/
this.fnCallback = function(sId, nErrCd, sErrMsg)
{
    //Transaction 에러는 공통에서 처리
    
    //Transaction은 성공이나 실제 처리된게 없을 경우 처리
    if( sErrMsg == "SUCC" )
    {
        //Success Script      
    } else {
        //Etc Script
    }   
    
    switch(sId)
    {
        case "PrdtList" : 		//거래처리스트 콜백
//trace(this, "### fnCallback.dsPrdtList.rowcount : " + this.dsPrdtList.rowcount);
//trace(this, "### fnCallback.dsPrdtList.CUST_CD : " + this.dsPrdtList.getColumn(this.dsPrdtList.rowcount - 1, "CUST_CD"));
// 			var sCodeNm = this.tabSearch.tabSearchBasic.form.edtCodeInfoSearch.value;
// 			var sUseYn = this.tabSearch.tabSearchBasic.form.cboUseYnSearch.value;
// 			if(!take.isEmpty(sCodeNm) || !take.isEmpty(sUseYn)){
// 				this.tabSearch.tabSearchBasic.form.grdPrdtList.selectRow(1);
// 			}
// 			this.fnTran('List');
            break;
			
        case "PrdtSelect":		//수정모드
//trace(this, "### fnCallback.dsPrdtInfo.getRowType : " + this.dsPrdtInfo.getRowType(0));
//trace(this, "### fnCallback.dsPrdtInfo.PRDT_NM : " + this.dsPrdtInfo.getColumn(this.dsPrdtInfo.rowcount - 1, "PRDT_NM"));
			this.fnDataset2Menu();
			this.tabPrdt.tabpBasic.form.divPrdtId.form.edtPrdtId.set_readonly(true);
			this.tabPrdt.tabpBasic.form.divPrdtNm.form.edtPrdtNm.setFocus();
			this.dsPrdtInfo.setRowType(0, Dataset.ROWTYPE_NORMAL);	//초기는 Dataset.ROWTYPE_NORMAL 로 해놓고 Update되면 변경
			this.tabPrdt.tabpBasic.form.divPrdtImage.form.ivPrdtImage.set_image(this.fv_sPrdtImage);
//trace(this, "### fnCallback.dsPrdtInfo.getRowType : " + this.dsPrdtInfo.getRowType(0));
			
// 			if (this.tabPrdt.tabpDetail.form.divPrdtSet.form.cbxSetYn.value)
// 				this.fnTran("PrdtSetSelect");	//세트메뉴 읽어오기
	
			if (this.dsPrdtInfo.rowcount < 2)
				this.dsPrdtInfo.addRow();
			this.dsPrdtInfo.copyRow(1, this.dsPrdtInfo, 0);		//1번 Row에 초기값 백업
			this.dsPrdtInfo.set_rowposition(0);
            break;

		case "PrdtIdSelect" :  	//신규입력
			this.dsPrdtInfo.clearData();
			this.dsPrdtInfo.addRow();
//trace(this, "### fnCallback.dsPrdtId.rowcount : " + this.dsPrdtId.rowcount);
			if (this.dsPrdtId.rowcount > 0) {
				var prdtId = this.dsPrdtId.getColumn(this.dsPrdtId.rowcount - 1, "PRDT_ID");
//trace(this, "### fnCallback.dsPrdtId.PRDT_ID : " + prdtId);
				this.tabPrdt.tabpBasic.form.divPrdtId.form.edtPrdtId.set_value(prdtId);
				this.tabPrdt.tabpBasic.form.divPrdtId.form.edtPrdtId.set_readonly(false);
				this.tabPrdt.tabpBasic.form.divPrdtNm.form.edtPrdtNm.setFocus();
			}
//trace(this, "### fnCallback.dsPrdtInfo.getRowType : " + this.dsPrdtInfo.getRowType(0));
			this.tabPrdt.tabpBasic.form.divPrdtImage.form.ivPrdtImage.set_image(this.fv_sPrdtImage);
	
			if (this.dsPrdtInfo.rowcount < 2)
				this.dsPrdtInfo.addRow();
			this.fnMenu2Dataset();
			this.dsPrdtInfo.copyRow(1, this.dsPrdtInfo, 0);		//1번 Row에 초기값 백업
			this.dsPrdtInfo.set_rowposition(0);
            break;
        
		case "PrdtSave" : //저장 콜백
			if (this.dsPrdtInfo.rowcount < 2)
				this.dsPrdtInfo.addRow();
			this.dsPrdtInfo.copyRow(1, this.dsPrdtInfo, 0);		//1번 Row에 초기값 백업
			this.dsPrdtInfo.set_rowposition(0);

			this.fnTran('PrdtList');
            break;
        
// 		case "List" :  //코드목록 콜백
//             this.fnTran('Language');
//             break;
        
		default :
            break;
    }        
};

/*********************************************************
* 3 필수 FUNCTION 영역 (fnSearch, fnSave, fnAddRow, fnDelRow)
********************************************************/
/**
 * fnSearch : 조회 transaction (필수) --> 공통 조회에서 호출할 디폴트값 세팅 필요
 * @param  {String} sTranId 트랜젝션 아이디
 * @return {N/A}    N/A
 * @example this.fnSearch("ID");
 */
this.fnSearch = function(sTranId)
{
    //공통 조회에서 호출할 디폴트값 세팅 필요
    if (take.nvl(sTranId, "")=="") sTranId = "PrdtList";
    
    this.fnTran(sTranId);
};

/**
 * fnSave : 저장 transaction (필수) -->공통 저장에서 호출할 디폴트값 세팅 필요
 * @param  {String} sTranId 트랜젝션 아이디
 * @return {N/A}    N/A
 * @example this.fnSave("ID");
 */
this.fnSave = function(sTranId)
{    
    //공통 조회에서 호출할 디폴트값 세팅 필요
    if (take.nvl(sTranId, "")=="") sTranId = "PrdtSave";
    
	var objDs     = this.dsPrdtInfo;
	
	// 벨리데이션	
 	var prdtNm = this.dsPrdtInfo.getColumn(0, "PRDT_NM");
 	var prdtId = this.dsPrdtInfo.getColumn(0, "PRDT_ID");
	
//trace(this, "### fnSave : " + prdtNm + ", " + this.dsPrdtInfo.getColumn(0, "PRDT_NM") + ", " + this.dsPrdtInfo.getColumn(1, "PRDT_NM") + ", " + this.dsPrdtInfo.rowposition);
	if(take.getTrim(prdtNm).length < 1) {
		take.alert(this, "info", "{title}을 입력해주세요.", {title : "품목명"});
		this.tabPrdt.set_tabindex(0);
		this.tabPrdt.tabpBasic.form.divPrdtNm.form.edtPrdtNm.setFocus();
		this.tabPrdt.tabpBasic.form.divPrdtNm.form.edtPrdtNm.setSelect(0, this.tabPrdt.tabpBasic.form.divPrdtNm.form.edtPrdtNm.value.length);
		return;
	}
	if(take.getTrim(prdtId).length < 1) {
		take.alert(this, "info", "품목코드를 입력해주세요.");
		this.tabPrdt.set_tabindex(0);
		this.tabPrdt.tabpBasic.form.divPrdtId.form.edtPrdtId.setFocus();
		this.tabPrdt.tabpBasic.form.divPrdtId.form.edtPrdtId.setSelect(0, this.tabPrdt.tabpBasic.form.divPrdtId.form.edtPrdtId.value.length);
		return;
	}
	
	this.fnMenu2Dataset();

	if (this.dsPrdtInfo.rowcount > 1)
		this.dsPrdtInfo.deleteRow(1);	//백업행 삭제
	
    this.fnTran(sTranId);
};

this.fnMenu2Dataset = function()
{
	var div = this.tabPrdt.tabpBasic.form;
	this.dsPrdtInfo.setColumn(0, "PRDT_TYPE", div.divPrdtType.form.cboPrdtType.value);
	this.dsPrdtInfo.setColumn(0, "GROUP_L_ID", div.divGroupId.form.cboGroupIdL.value);
	this.dsPrdtInfo.setColumn(0, "GROUP_M_ID", div.divGroupId.form.cboGroupIdM.value);
	this.dsPrdtInfo.setColumn(0, "GROUP_S_ID", div.divGroupId.form.cboGroupIdS.value);
	this.dsPrdtInfo.setColumn(0, "PRDT_STANDARD1", div.divPrdtStandard.form.cboPrdtStandard1.value);
	this.dsPrdtInfo.setColumn(0, "PRDT_STANDARD2", div.divPrdtStandard.form.cboPrdtStandard2.value);
	this.dsPrdtInfo.setColumn(0, "PRDT_STANDARD3", div.divPrdtStandard.form.cboPrdtStandard3.value);
	this.dsPrdtInfo.setColumn(0, "PRDT_STANDARD4", div.divPrdtStandard.form.cboPrdtStandard4.value);
	this.dsPrdtInfo.setColumn(0, "PRDT_STANDARD5", div.divPrdtStandard.form.cboPrdtStandard5.value);
	this.dsPrdtInfo.setColumn(0, "PRDT_UNIT", div.divPrdtUnit.form.cboPrdtUnit.value);
	this.dsPrdtInfo.setColumn(0, "BOX_UNIT", div.divBoxUnit.form.cboBoxUnit.value);
	this.dsPrdtInfo.setColumn(0, "VAT_CD", div.divVat.form.rdVat.value);
	this.dsPrdtInfo.setColumn(0, "USE_YN", div.divUseYn.form.cboUseYn.value);
	
	div = this.tabPrdt.tabpDetail.form;
	this.dsPrdtInfo.setColumn(0, "BASE_WH_CD", div.divBaseWh.form.cboBaseWh.value);
	this.dsPrdtInfo.setColumn(0, "SERIAL_CODE_TYPE", div.divSerialCodeType.form.cboSerialCodeType.value);
	this.dsPrdtInfo.setColumn(0, "LOT_NO_TYPE", div.divLotNoType.form.cboLotNoType.value);
	this.dsPrdtInfo.setColumn(0, "WARRANTY_GBN_CD", div.divWarranty.form.cboWarranty.value);
	this.dsPrdtInfo.setColumn(0, "SHELF_LIFE_GBN_CD", div.divShelfLife.form.cboShelfLife.value);
	this.dsPrdtInfo.setColumn(0, "SET_YN", div.divPrdtSet.form.cbxSetYn.value ? CODE_Y : CODE_N);
	if (div.divWarranty.form.cboWarranty.value == this.dsWarranty.getColumn(0, "CODE")) {	//미사용
		div.divWarranty.form.edtWarranty.set_value("");
	}
	if (div.divShelfLife.form.cboShelfLife.value == this.dsShelfLife.getColumn(0, "CODE")) {	//미사용
		div.divShelfLife.form.edtShelfLife.set_value("");
	}
	this.setPriceDataset(this.dsPrdtInfo.getColumn(0, "PRDT_PRICE1"), this.dsPrdtInfo.getColumn(0, "PRDT_PRICE2"), this.dsPrdtInfo.getColumn(0, "PRDT_PRICE3"));
}

this.fnDataset2Menu = function()
{
	var div = this.tabPrdt.tabpBasic.form;
	div.divPrdtType.form.cboPrdtType.set_value(this.dsPrdtInfo.getColumn(0, "PRDT_TYPE"));
	div.divGroupId.form.cboGroupIdL.set_value(this.dsPrdtInfo.getColumn(0, "GROUP_L_ID"));
	div.divGroupId.form.cboGroupIdM.set_value(this.dsPrdtInfo.getColumn(0, "GROUP_M_ID"));
	div.divGroupId.form.cboGroupIdS.set_value(this.dsPrdtInfo.getColumn(0, "GROUP_S_ID"));
	div.divPrdtStandard.form.cboPrdtStandard1.set_value(this.dsPrdtInfo.getColumn(0, "PRDT_STANDARD1"));
	div.divPrdtStandard.form.cboPrdtStandard2.set_value(this.dsPrdtInfo.getColumn(0, "PRDT_STANDARD2"));
	div.divPrdtStandard.form.cboPrdtStandard3.set_value(this.dsPrdtInfo.getColumn(0, "PRDT_STANDARD3"));
	div.divPrdtStandard.form.cboPrdtStandard4.set_value(this.dsPrdtInfo.getColumn(0, "PRDT_STANDARD4"));
	div.divPrdtStandard.form.cboPrdtStandard5.set_value(this.dsPrdtInfo.getColumn(0, "PRDT_STANDARD5"));
	this.cboGroupIdL_onitemchanged(div.divGroupId.form.cboGroupIdL);
	
	div.divPrdtUnit.form.cboPrdtUnit.set_value(this.dsPrdtInfo.getColumn(0, "PRDT_UNIT"));
	div.divBoxUnit.form.cboBoxUnit.set_value(this.dsPrdtInfo.getColumn(0, "BOX_UNIT"));
	div.divVat.form.rdVat.set_value(this.dsPrdtInfo.getColumn(0, "VAT_CD"));
	div.divUseYn.form.cboUseYn.set_value(this.dsPrdtInfo.getColumn(0, "USE_YN"));
	
	div = this.tabPrdt.tabpDetail.form;
	div.divBaseWh.form.cboBaseWh.set_value(this.dsPrdtInfo.getColumn(0, "BASE_WH_CD"));
	div.divSerialCodeType.form.cboSerialCodeType.set_value(this.dsPrdtInfo.getColumn(0, "SERIAL_CODE_TYPE"));
	div.divLotNoType.form.cboLotNoType.set_value(this.dsPrdtInfo.getColumn(0, "LOT_NO_TYPE"));
	div.divWarranty.form.cboWarranty.set_value(this.dsPrdtInfo.getColumn(0, "WARRANTY_GBN_CD"));
	div.divShelfLife.form.cboShelfLife.set_value(this.dsPrdtInfo.getColumn(0, "SHELF_LIFE_GBN_CD"));
	div.divPrdtSet.form.cbxSetYn.set_value(this.dsPrdtInfo.getColumn(0, "SET_YN") == CODE_Y);
	this.tabPrdt_cbxSetYn_onchanged(div.divPrdtSet.form.cbxSetYn);
	this.resetPriceTooltip(this.dsPrdtInfo.getColumn(0, "PRDT_PRICE1"), this.dsPrdtInfo.getColumn(0, "PRDT_PRICE2"), this.dsPrdtInfo.getColumn(0, "PRDT_PRICE3"));

	//월마감 후  25일(월말)
	this.fnSetWarrantyMenu(div.divWarranty.form.cboWarranty, 
						div.divWarranty.form.edtWarranty,
						this.dsWarranty);
	this.fnSetWarrantyMenu(div.divShelfLife.form.cboShelfLife, 
						div.divShelfLife.form.edtShelfLife,
						this.dsShelfLife);

	this.tabPrdt.tabpBasic.form.divPrdtNm.form.edtPrdtNm.setFocus();
	this.tabPrdt.tabpBasic.form.divPrdtNm.form.edtPrdtNm.setSelect(0, this.tabPrdt.tabpBasic.form.divPrdtNm.form.edtPrdtNm.value.length);
}

this.setPriceDataset = function(sPrice1, sPrice2, sPrice3)
{
	let arrPrice = [sPrice1, sPrice2, sPrice3];
	
	let addCount = arrPrice.length - this.dsPrdtPrice.rowcount;
	for (var n = 0; n < addCount; n++) {
		this.dsPrdtPrice.addRow();
	}
	
	for (var n = 0; n < this.dsPrdtPrice.rowcount; n++) {
		this.dsPrdtPrice.setColumn(n, "PROJECT_CD", this.fv_sProjectCd);
		this.dsPrdtPrice.setColumn(n, "PRDT_ID", this.dsPrdtInfo.getColumn(0, "PRDT_ID"));
		this.dsPrdtPrice.setColumn(n, "PRICE_SEQ", n + 1);
		this.dsPrdtPrice.setColumn(n, "PRICE", arrPrice[n]);
	}

	this.resetPriceTooltip(sPrice1, sPrice2, sPrice3);
}

this.resetPriceTooltip = function(sPrice1, sPrice2, sPrice3)
{
	var sPriveTooltip = sPrice1 + " / " + sPrice2 + " / " + sPrice3;
	this.tabPrdt.tabpBasic.form.divSalePrice.form.staPriceReg.set_tooltiptext(sPriveTooltip);
}

/**
 * fnInitMenu : 품목관리 메뉴 초기화
 * @param  {N/A}    N/A
 * @return {N/A}    N/A
 * @example this.fnInitMenu();
 */
this.fnInitMenu = function()
{ 
	if (this.dsPrdtInfo.rowcount < 1)
		this.dsPrdtInfo.addRow();

	this.dsPrdtSetList.clearData();
	this.dsFile.clearData();

	//견적정보 탭
	tabp = this.tabPrdt.tabpEstimate.form;
	tabp.divEstimatePrdtNm.form.edtEstimatePrdtNm.set_value("");
	tabp.divPrdtDesc.form.txaPrdtDesc.set_value("");

	//상세정보 탭
	tabp = this.tabPrdt.tabpDetail.form;
	tabp.divOptimalStockCnt.form.edtOptimalStockCnt.set_value("");
	tabp.divInCust.form.edtInCustNm.set_value("");
	tabp.divBaseWh.form.cboBaseWh.set_index(0);
	if (this.dsSerialCodeType.rowcount > 0)
		tabp.divSerialCodeType.form.cboSerialCodeType.set_value(this.dsSerialCodeType.getColumn(0, "CODE"));
	if (this.dsLotNoType.rowcount > 0)
		tabp.divLotNoType.form.cboLotNoType.set_value(this.dsLotNoType.getColumn(0, "CODE"));

	if (this.dsWarranty.rowcount > 0)
		tabp.divWarranty.form.cboWarranty.set_value(this.dsWarranty.getColumn(0, "CODE"));
	tabp.divWarranty.form.edtWarranty.set_value("");
	this.fnSetWarrantyMenu(tabp.divWarranty.form.cboWarranty, 
						tabp.divWarranty.form.edtWarranty,
						this.dsWarranty);

	if (this.dsShelfLife.rowcount > 0)
		tabp.divShelfLife.form.cboShelfLife.set_value(this.dsShelfLife.getColumn(0, "CODE"));
	tabp.divShelfLife.form.edtShelfLife.set_value("");
	this.fnSetWarrantyMenu(tabp.divShelfLife.form.cboShelfLife, 
						tabp.divShelfLife.form.edtShelfLife,
						this.dsShelfLife);
	tabp.divPrdtSet.form.cbxSetYn.set_value(false);
	this.tabPrdt_cbxSetYn_onchanged(tabp.divPrdtSet.form.cbxSetYn);
	this.tabPrdt.tabpBasic.form.divPrdtImage.form.ivPrdtImage.set_image(this.fv_sPrdtImage);

	//기본정보 탭
	tabp = this.tabPrdt.tabpBasic.form;
	tabp.divPrdtNm.form.edtPrdtNm.set_value("");
	tabp.divPrdtId.form.edtPrdtId.set_value("");
	tabp.divGroupId.form.cboGroupIdL.set_index(0);
	tabp.divGroupId.form.cboGroupIdM.set_index(0);
	tabp.divGroupId.form.cboGroupIdS.set_index(0);

	tabp.divPrdtStandard.form.cboPrdtStandard1.set_index(0);
	tabp.divPrdtStandard.form.cboPrdtStandard2.set_index(0);
	tabp.divPrdtStandard.form.cboPrdtStandard3.set_index(0);
	tabp.divPrdtStandard.form.cboPrdtStandard4.set_index(0);
	tabp.divPrdtStandard.form.cboPrdtStandard5.set_index(0);
	this.cboGroupIdL_onitemchanged(tabp.divGroupId.form.cboGroupIdL);

	if (this.dsPrdtUnit.rowcount > 0)
		tabp.divPrdtUnit.form.cboPrdtUnit.set_value(this.dsPrdtUnit.getColumn(0, "CODE"));
	if (this.dsBoxUnit.rowcount > 0)
		tabp.divBoxUnit.form.cboBoxUnit.set_value(this.dsBoxUnit.getColumn(0, "CODE"));
	tabp.divBoxUnit.form.edtCntPerBox.set_value("");
	tabp.divBoxBarcode.form.edtBoxBarcode.set_value("");

	if (this.dsPrdtType.rowcount > 0)
		tabp.divPrdtType.form.cboPrdtType.set_value(this.dsPrdtType.getColumn(0, "CODE"));
	tabp.divBarcode.form.edtBarcode.set_value("");
	if (APP.gdsVat.rowcount > 0)
		tabp.divVat.form.rdVat.set_value(APP.gdsVat.getColumn(0, "CODE"));
	tabp.divInPrice.form.edtInPrice.set_value("");
	tabp.divSalePrice.form.edtSalePrice.set_value("");
    tabp.divUseYn.form.cboUseYn.set_value(CODE_Y);
	//tabp.divPrdtImage.form.ivPrdtImage

	this.tabPrdt.set_tabindex(0);
	tabp.divPrdtNm.form.edtPrdtNm.setFocus();
	tabp.divPrdtNm.form.edtPrdtNm.setSelect(0, tabp.divPrdtNm.form.edtPrdtNm.value.length);

	//검색탭에 날짜 설정 : 이전1달
	var curDate = new Date();
	var prevDate = new Date();
	prevDate.setMonth(prevDate.getMonth() - 1);

	var sCurDate = solbar.getyyyyMMdd(curDate);
	var sPrevDate = solbar.getyyyyMMdd(prevDate);
	
	this.tabSearch.tabSearchBasic.form.divSearch.form.calFromDate.set_value(prevDate);
	this.tabSearch.tabSearchBasic.form.divSearch.form.calToDate.set_value(curDate);
	
	this.tabSearch.tabSearchBasic.form.divSearch.form.cboUseYn.set_value(CODE_Y);
	
	this.dsPrdtInfo.setColumn(0, "PRDT_PRICE1", "0");
	this.dsPrdtInfo.setColumn(0, "PRDT_PRICE2", "0");
	this.dsPrdtInfo.setColumn(0, "PRDT_PRICE3", "0");
	this.resetPriceTooltip(this.dsPrdtInfo.getColumn(0, "PRDT_PRICE1"), this.dsPrdtInfo.getColumn(0, "PRDT_PRICE2"), this.dsPrdtInfo.getColumn(0, "PRDT_PRICE3"));
}

this.fnSetWarrantyMenu = function(cboWarranty, edtWarranty, objDataset)
{
	var sUnuseCode = objDataset.getColumn(0, "CODE");
	var bReceivableUse = (cboWarranty.value != sUnuseCode);
	edtWarranty.set_visible(bReceivableUse);
	if (!bReceivableUse) {	//없음
		edtWarranty.set_value("");
	}
}

/**
 * fnAddRow : 행 추가 함수 (필수)--> 공통 행추가에서 호출할 디폴트값 세팅 필요
 * @param  {String} sGridId 그리드 아이디
 * @param  {Number} nRow    addRow 리턴값(추가된 행 위치)
 * @example this.fnAddRow(sGrdId, nRow);
 */
this.fnAddRow = function(sGrdId, nRow)
{
	var sParentKey, sGroupId;
	
	//현재 리스트에 데이터가 있으면
	if ( this.dsCodeInfo.rowcount > 0 )
	{
		//같은 레벨임으로 같은 그룹 아이디를 가져다 씀
		sParentKey = this.dsCodeInfo.getColumn(0, "PARENT_KEY");
		sGroupId   = this.dsCodeInfo.getColumn(0, "GROUP_ID");
	}
	else {  
		//없을경우 코드그룹 리스트에서 현재 선택된 Row의 코드 아이디를 가져옴
		sParentKey = this.dsPrdtList.getColumn(this.dsPrdtList.rowposition, "CODE_KEY");
		sGroupId   = sParentKey.substring(5, 10);
	}
	
	
	var nRow = this.dsCodeInfo.addRow();
	
	if( sParentKey == "0000000000" ){
		this.dsCodeInfo.setColumn(nRow, "CODE_ID", "자동생성");
		this.tabList.Tabpage1.form.grdCodeInfo.setCellPos(2);
		this.tabList.Tabpage1.form.grdCodeInfo.setFocus();
	}
	else{
		this.dsCodeInfo.setColumn(nRow, "CODE_ID", "");
		this.tabList.Tabpage1.form.grdCodeInfo.setCellPos(1);
		this.tabList.Tabpage1.form.grdCodeInfo.setFocus();
	}
	
	//기본 값 세팅(그룹아이디, 사용여부)
	var nMaxOrder = parseInt(this.dsCodeInfo.getMax("CODE_ORDER")+1);
	this.dsCodeInfo.setColumn(nRow, "CODE_ORDER", take.nvl(nMaxOrder, "99"));
	this.dsCodeInfo.setColumn(nRow, "PROJECT_CD"   	,this.fv_sProjectCd);
	this.dsCodeInfo.setColumn(nRow, "CODE_NM"   	, "");
	this.dsCodeInfo.setColumn(nRow, "PARENT_KEY", sParentKey);
	this.dsCodeInfo.setColumn(nRow, "GROUP_ID", sGroupId);
	this.dsCodeInfo.setColumn(nRow, "USE_YN", "Y");
	
	//신규 코드임으로 다국어 데이터 Clear
	this.dsMultiLanguageDetail.clearData();
	
};


/*********************************************************
 * 4 각 COMPONENT 별 EVENT 영역
  ********************************************************/
//그룹 리스트 클릭이벤트
this.tabPrdt_grdPrdtList_oncellclick = function(obj:nexacro.Grid,e:nexacro.GridClickEventInfo)
{
//take.debug(this, "### tabPrdt_grdPrdtList_oncellclick.PRDT_ID [" + e.row + "] " + this.dsPrdtList.getColumn(e.row, "PRDT_ID"));
	if(e.clickitem == "") 
    {        
    }
//trace("@@@ grdPrdtList_oncellclick : " + this.dsPrdtInfo.getRowType(0) + ", " + take.nvl(this.dsPrdtInfo.getColumn(0, "PRDT_NM"), ""));
	this.fnMenu2Dataset();
	if (!solbar.isEqualRow(this.dsPrdtInfo, 0, 1)) {	//백업해놓은 1번째 row와 같은지 비교
		var bCancel = take.confirm(this, "Info", "작업중인 품목을 취소하고 새로 지정 하시겠습니까?");
		if (!bCancel) {
			return;
		}
	}
    this.fnSearch('PrdtSelect');
};
/*
this.isEqualRow = function(ds, row1, row2) {
	var bEqual = true;
	
	for (var n = 0; n < this.dsPrdtInfo.colcount; n++) {
		var v1 = take.nvl(this.dsPrdtInfo.getColumn(row1, n), "");
		var v2 = take.nvl(this.dsPrdtInfo.getColumn(row2, n), "");
trace(this, "### isEqualRow [" + n + "] : [" + v1 + "] => [" +  v2 + "]");
		if(take.isEmpty(v1) || take.isNull(v1))
			continue;
		if(!isNaN(v1)) {
			v1  = Number(v1);
//trace(this, "### Number.v1 [" + v1 + "]");
		}
		if(!isNaN(v2)) {
			v2  = Number(v2);
//trace(this, "### Number.v2 [" + v2 + "]");
		}
		if(v1 != v2) {
			bEqual = false;
trace(this, "### isEqualRow.bEqual [" + n + "] : " + bEqual);
			break;
		}
	}
	
	return bEqual;
}
*/

this.tabSearch_btnSearchDate_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
{
	this.fnSearch();
};

this.tabSearch_btnSearchDateToday_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
{
	//검색탭에 날짜 설정 : 오늘
	var curDate = new Date();
	var sCurDate = solbar.getyyyyMMdd(curDate);
	
	this.tabSearch.tabSearchBasic.form.divSearch.form.calFromDate.set_value(sCurDate);
	this.tabSearch.tabSearchBasic.form.divSearch.form.calToDate.set_value(curDate);

	this.fnSearch();
};

this.tabSearch_btnSearchDate7D_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
{
	//검색탭에 날짜 설정 : 이전7일
	var curDate = new Date();
	var prevDate = new Date();
	prevDate.setDate(prevDate.getDate() - 7);

	var sCurDate = solbar.getyyyyMMdd(curDate);
	var sPrevDate = solbar.getyyyyMMdd(prevDate);
	
	this.tabSearch.tabSearchBasic.form.divSearch.form.calFromDate.set_value(prevDate);
	this.tabSearch.tabSearchBasic.form.divSearch.form.calToDate.set_value(curDate);

	this.fnSearch();
};

this.tabSearch_btnSearchDate1M_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
{
	//검색탭에 날짜 설정 : 이전1달
	var curDate = new Date();
	var prevDate = new Date();
	prevDate.setMonth(prevDate.getMonth() - 1);

	var sCurDate = solbar.getyyyyMMdd(curDate);
	var sPrevDate = solbar.getyyyyMMdd(prevDate);
	
	this.tabSearch.tabSearchBasic.form.divSearch.form.calFromDate.set_value(prevDate);
	this.tabSearch.tabSearchBasic.form.divSearch.form.calToDate.set_value(curDate);

	this.fnSearch();
};

this.tabSearch_btnSearchDateAll_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
{
	//검색탭에 날짜 설정 : 이전10년
	var curDate = new Date();
	var prevDate = new Date();
	prevDate.setFullYear(prevDate.getFullYear() - 10);

	var sCurDate = solbar.getyyyyMMdd(curDate);
	var sPrevDate = solbar.getyyyyMMdd(prevDate);
	
	this.tabSearch.tabSearchBasic.form.divSearch.form.calFromDate.set_value(prevDate);
	this.tabSearch.tabSearchBasic.form.divSearch.form.calToDate.set_value(curDate);

	this.fnSearch();
};

this.divSearch_btnSearch_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
{
	this.fnSearch();
};

/*********************************************************
* 5 사용자 FUNCTION 영역
********************************************************/
this.getPrdtId = function()
{
	return take.nvl(this.tabPrdt.tabpBasic.form.divPrdtId.form.edtPrdtId.value, "");
}

this.getPrdtNm = function()
{
	return take.nvl(this.tabPrdt.tabpBasic.form.divPrdtNm.form.edtPrdtNm.value, "");
}

this.fnSearchPop = function()
{
	var sTranId = take.getUniqueId("scmCodePop");
	var sParam = solbar.getProjectParam();
	sParam = solbar.addParam(sParam, "SET_YN", CODE_N);
	sParam = solbar.addParam(sParam, "USE_YN", CODE_Y);

	var oArg = {
	     Title:		"품목검색 (SET품목 제외)", 
		 Dataset: 	"", 
		 NameSpace: "Prdt.prdtInfoListSearch", 
		 InDataset: "", 
		 Param: 	sParam, 
		 ColInfo:	[["PRDT_ID", "품목코드", "20"],["PRDT_NM", "품목명", "30"],["PRDT_GROUP_S_NM", "품목그룹명", "30"],["BARCODE", "바코드", "30"]],
		 Multi:		false, 
		 CallBack:	"fnReturnCB"		//선택한 값 넘겨받을 CallBack
	};

	take.openPopup(this, 
	                sTranId, 
				    solbar.codeSelPopUrl, 		//"scm::scmSelPopUp.xfdl"
					oArg, 
					"showtitlebar=true layered=false", 
					function(sId, sRtn) { }, 	//CallBack
					false);						//Modaless
};
/**
 * fnReturnCB : 코드선택시 콜백함수
 */
//Selected Callback Interface
this.fnReturnCB = function(objRow){
	if (Array.isArray(objRow)) {
		for (var n = 0; n < objRow.length; n++) {
 			var objTmpRow = objRow[n];
//  			for(var paramKey in objRow) {
//  				var searchValue = objRow[paramKey];
//  				trace("@@@ fnSetSelectedRow.objTmpRow.v : [" + n + "] " + paramKey + ", " + searchValue);
//  			}
 		}
	}
	else {
		this.fvObjRow = objRow;
		
		var prdtId = objRow["PRDT_ID"];
		var prdtNm = objRow["PRDT_NM"];
		if (prdtId == this.tabPrdt.tabpBasic.form.divPrdtId.form.edtPrdtId.value) {
			take.alert(this, "info", "{title}은 작업중인 품목과 동일합니다.", {title : prdtNm});
			return;
		}
		for (var n = 0; n < this.dsPrdtSetList.rowcount; n++) {
//trace("@@@ fnReturnCB.fvObjRow : " + n + ", " + prdtId + ", " + this.dsPrdtSetList.getColumn(n, "SET_PRDT_ID"));
			if (prdtId == this.dsPrdtSetList.getColumn(n, "SET_PRDT_ID")) {
				take.alert(this, "info", "{title}은 {no}행에 이미 선택한 품목입니다.", {title : prdtNm, no : n+1});
				return;
			}
		}
		var nRow = this.dsPrdtSetList.addRow();
		this.dsPrdtSetList.setColumn(nRow, "PROJECT_CD", this.fv_sProjectCd);
		this.dsPrdtSetList.setColumn(nRow, "PARENT_PRDT_ID", this.tabPrdt.tabpBasic.form.divPrdtId.form.edtPrdtId.value);
		this.dsPrdtSetList.setColumn(nRow, "PARENT_PRDT_NM", this.tabPrdt.tabpBasic.form.divPrdtNm.form.edtPrdtNm.value);
		this.dsPrdtSetList.setColumn(nRow, "SET_PRDT_ID", prdtId);
		this.dsPrdtSetList.setColumn(nRow, "SET_PRDT_NM", prdtNm);
		this.dsPrdtSetList.setColumn(nRow, "CNT", "1");
		this.tabPrdt.tabpDetail.form.divPrdtSet.form.grdPrdtSet.setCellPos(2);
		this.tabPrdt.tabpDetail.form.divPrdtSet.form.grdPrdtSet.setFocus();
//    		for(var paramKey in objRow){
//    			var searchValue = objRow[paramKey];
//    			trace("@@@ fnReturnCB.fvObjRow.v : " + paramKey + ", " + searchValue);
//    		}
	}
};

this.tabPrdt_btnNewPrdtSet_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
{
	this.fnSearchPop();
return;
	var nRow;
	if ( this.dsPrdtSetList.rowcount > 0 ) {
		nRow = this.dsPrdtSetList.rowcount - 1;
		if (take.nvl(this.dsPrdtSetList.getColumn(nRow, "SET_PRDT_ID"), "") != "")
			nRow = this.dsPrdtSetList.addRow();
	}
	else {
		nRow = this.dsPrdtSetList.addRow();
	}
	if (take.nvl(this.dsPrdtSetList.getColumn(nRow, "PROJECT_CD"), "") == "") {
		this.dsPrdtSetList.setColumn(nRow, "PROJECT_CD", this.fv_sProjectCd);
		this.dsPrdtSetList.setColumn(nRow, "PARENT_PRDT_ID", this.tabPrdt.tabpBasic.form.divPrdtId.form.edtPrdtId.value);
		this.dsPrdtSetList.setColumn(nRow, "PARENT_PRDT_NM", this.tabPrdt.tabpBasic.form.divPrdtNm.form.edtPrdtNm.value);
	}
	this.tabPrdt.tabpDetail.form.divPrdtSet.form.grdPrdtSet.setCellPos(0);
	this.tabPrdt.tabpDetail.form.divPrdtSet.form.grdPrdtSet.setFocus();
/*
	var custNm = this.dsPrdtInfo.getColumn(0, "CUST_NM");
	var custCd = this.dsPrdtInfo.getColumn(0, "CUST_CD");
take.debug(this, "### tabPrdt_tabpBasic_btnNewCustMan_onclick : " + custNm + ", " + custCd);
	var oArg = {
		CUST_NM : custNm,
		CUST_CD : custCd
	};

	take.openPopup(this, "sbaCustManRegPopUp", "sba::sbaCustManRegPopUp.xfdl", oArg,"", 
				function(){
				});
*/
};

this.tabPrdt_onchanged = function(obj:nexacro.Tab,e:nexacro.TabIndexChangeEventInfo)
{
	tabp = obj.tabpages.get_item(obj.tabpages.get_id(e.postindex)).form;
	div = tabp;

	switch(obj.tabpages.get_id(e.postindex)) {
		case "tabpBasic" : 
			//div를 tabp.divIndividual.form, tabp.divBusiness.form 으로 변경
			//this.tabPrdt.tabpBasic.form.divCustGbn.form.rdCustGbn.set_value(this.dsCustType.getColumn(1, "CODE"));	//기업고객
			break;
		case "tabpDetail" : 
			break;
	}
	
//take.debug(this, "### tabPrdt_onchanged.postindex : " + e.postindex + ", " + obj.tabpages.get_id(e.postindex));
};

this.tabPrdt_grdPrdtSet_onenterdown = function(obj:nexacro.Grid,e:nexacro.GridEditEventInfo)
{
//take.debug(this, "### tabPrdt_tabpBasic_divCustMan_grdCustManager_onenterdown : " + e.cell + ", " + e.value);
	if ((e.cell == 0) && (take.nvl(e.value, "") == "")) {
 		obj.setCellPos(2);
 		obj.setFocus();
		return;
	}
	
// 	if (e.cell < 2) {
// 		obj.moveToNextCell();
// 	}
// 	else {
		//수량만 그리드에서 수정 가능
		obj.setCellPos(2);
		obj.setFocus();
//	}
};

this.tabPrdt_grdPrdtSet_oncellclick = function(obj:nexacro.Grid,e:nexacro.GridClickEventInfo)
{
	if (e.cell == 3) {
		var bRowDel = take.confirm(this, "Info", "{name}({id})을(를) 삭제 하시겠습니까?", 
								{name : this.dsPrdtSetList.getColumn(e.row, "SET_PRDT_NM"), id : this.dsPrdtSetList.getColumn(e.row, "SET_PRDT_ID")});
		if (bRowDel) {
			this.dsPrdtSetList.deleteRow(e.row);
		}
	}
};

this.tabSearch_divSearch_edtSearch_onkeydown = function(obj:nexacro.Edit,e:nexacro.KeyEventInfo)
{
	if(e.keycode == 13){
		this.fnTran("PrdtList");
	}
};

this.tabPrdt_cboWarranty_onitemchanged = function(obj:nexacro.Combo,e:nexacro.ItemChangeEventInfo)
{
	this.fnSetWarrantyMenu(obj, 
						this.tabPrdt.tabpDetail.form.divWarranty.form.edtWarranty,
						this.dsWarranty);
	this.tabPrdt.tabpDetail.form.divWarranty.form.edtWarranty.setFocus();
	this.tabPrdt.tabpDetail.form.divWarranty.form.edtWarranty.setSelect(0, this.tabPrdt.tabpDetail.form.divWarranty.form.edtWarranty.value.length);
};

this.tabPrdt_cboShelfLife_onitemchanged = function(obj:nexacro.Combo,e:nexacro.ItemChangeEventInfo)
{
	this.fnSetWarrantyMenu(obj, 
						this.tabPrdt.tabpDetail.form.divShelfLife.form.edtShelfLife,
						this.dsShelfLife);
	this.tabPrdt.tabpDetail.form.divShelfLife.form.edtShelfLife.setFocus();
	this.tabPrdt.tabpDetail.form.divShelfLife.form.edtShelfLife.setSelect(0, this.tabPrdt.tabpDetail.form.divShelfLife.form.edtShelfLife.value.length);
};

this.tabPrdt_cbxSetYn_onchanged = function(obj:nexacro.CheckBox,e:nexacro.CheckBoxChangedEventInfo)
{
//take.debug(this, "$$$ cbxSetYn_onchanged : " + obj.value);
	this.tabPrdt.tabpDetail.form.divPrdtSet.form.btnNewPrdtSet.set_enable(obj.value);
	this.tabPrdt.tabpDetail.form.divPrdtSet.form.grdPrdtSet.set_enable(obj.value);
	if (!obj.value) {
		var bPrdtSetListDel = true;
		if(this.dsPrdtSetList.rowcount > 0) {
			if(this.dsPrdtSetList.getColumn(this.dsPrdtSetList.rowcount - 1, "SET_PRDT_ID") != "")
				bPrdtSetListDel = take.confirm(this, "Info", "세트품목이 아니면 구성된 품목을 모두 삭제합니다.\n세트 구성품목을 모두 삭제 하시겠습니까?");
		}
		if (bPrdtSetListDel) {
			this.dsPrdtSetList.deleteAll();
		}
	}
};

this.tabPrdt_tabpBasic_divPrdtImage_ivPrdtImage_onclick = function(obj:nexacro.ImageViewer,e:nexacro.ClickEventInfo)
{
	this.FileDialog.open('nexacro17', FileDialog.MULTILOAD);
};

this.FileDialog_onclose = function(obj:nexacro.FileDialog,e:nexacro.FileDialogEventInfo)
{
	this.addFileList(e.virtualfiles);
};
this.addFileList = function(filelist)
{
	for (var i = 0, len = filelist.length, vFile; i < len; i++)
	{
		vFile = filelist[i];		
 		vFile.addEventHandler("onsuccess", this.FileList_onsuccess, this);
 		vFile.addEventHandler("onerror", this.FileList_onerror , this);

		vFile.open(null, nexacro.VirtualFile.openBinary);
	}
};

this.fv_nUploadIdx = 0;
this.fv_nUpFileCnt = 0;
this.fv_vFile = null;

this.fv_bData = null;
this.fv_sFileDelYn = "N";
this.fv_sFileSize = "";
this.fv_sFileType = "USER";

//파일추가 후처리 성공이벤트
this.FileList_onsuccess = function(obj:nexacro.VirtualFile, e:nexacro.VirtualFileEventInfo)
{
trace("### FileList_onsuccess : " + e.reason);
	var objImageView = this.tabPrdt.tabpBasic.form.divPrdtImage.form.ivPrdtImage;

	switch (e.reason)
	{
		case 1:	
			objImageView.set_text("");
			obj.getFileSize();
			
			break;		
		case 3: // read() 실행시 추가 실행
			objImageView.set_image("data:image/png;base64," + e.binarydata);
			this.fv_bData = e.binarydata;
			
			this.dsFile.clearData();
			var addidx = this.dsFile.addRow();
			this.dsFile.setColumn(addidx, "FILE_NM", nexacro.trim(obj.filename));
			this.dsFile.setColumn(addidx, "FILE_BLOB", this.fv_bData);
			this.dsFile.setColumn(addidx, "IMPORT_YN", "N");
			this.dsFile.setColumn(addidx, "FILE_TYPE", this.fv_sFileType);
			this.dsFile.setColumn(addidx, "FILE_SIZE", this.fv_sFileSize);
			
			break;		
		case 9:	// getFileSize() 실행시 추가 실행	
			if( nexacro._Browser == "Runtime" )
			{
				//파일 바이너리데이터 생성
				obj.read("utf-8");
			}
			else
			{
				var objIframe = window.document.getElementsByTagName('iframe');
				var nIframeCnt = (objIframe.length - 1);
				var objInput = objIframe[nIframeCnt].contentWindow.document.getElementsByTagName("input");
				var objDsFile = this.dsFile;
				
				for (var i = 0; i < objInput.length; i++) {				
					if (objInput[i].type == "file") {
						if( objInput[i].files.length > 0 )
						{
							var reader  = new FileReader();
							reader.addEventListener("load", function(){
								objImageView.set_image(reader.result);
								
								objDsFile.setColumn(addidx, "FILE_BLOB", reader.result);
								objDsFile.setColumn(addidx, "IMPORT_YN", "N");
							});
							
							reader.readAsDataURL(objInput[i].files[0], "EUC-KR");
							objDsFile.clearData();
							var addidx = objDsFile.addRow();
							objDsFile.setColumn(addidx, "FILE_NM", nexacro.trim(objInput[i].files[0].name));
							objDsFile.setColumn(addidx, "FILE_TYPE", this.fv_sFileType);
							objDsFile.setColumn(addidx, "FILE_SIZE", this.fv_sFileSize);
							
							objFileUpTransfer.addFile(obj.filename, obj);
						}
					}
				}	
			}
		
			break;
		default :			
			break;
	}	
};

//파일추가 후처리 실패이벤트
this.FileList_onerror = function(obj:nexacro.VirtualFile, e:nexacro.VirtualFileErrorEventInfo)
{
	trace("errortype: "+e.errortype);
	trace("errormsg: "+e.errormsg);
	trace("statuscode: "+e.statuscode);
};

this.getGroupCode = function(pcode, ppcode)
{
	var groupCode;
    if (take.nvl(ppcode, "")=="") 
		groupCode = "0000";
	else
		groupCode = ppcode.substring(0, 4);

	groupCode += pcode.substring(0, 4);
	
	return groupCode;
}

this.cboGroupIdL_onitemchanged = function(obj:nexacro.Combo,e:nexacro.ItemChangeEventInfo)
{
	var groupCodeM = this.getGroupCode(obj.value);
	this.dsPrdtGroupM.filter();
	var sFilter = "PCODE.toString().indexOf('" + groupCodeM + "') == 0";
	this.dsPrdtGroupM.filter(sFilter);
	//this.tabPrdt.tabpBasic.form.divGroupId.form.cboGroupIdM.set_index(0);
	this.cboGroupIdM_onitemchanged(this.tabPrdt.tabpBasic.form.divGroupId.form.cboGroupIdM);
	//this.dsPrdtGroupS.filter();
};

this.cboGroupIdM_onitemchanged = function(obj:nexacro.Combo,e:nexacro.ItemChangeEventInfo)
{
	var groupCodeS = this.getGroupCode(obj.value, this.tabPrdt.tabpBasic.form.divGroupId.form.cboGroupIdL.value);
	this.dsPrdtGroupS.filter();
	var sFilter = "PCODE.toString().indexOf('" + groupCodeS + "') == 0";
	this.dsPrdtGroupS.filter(sFilter);
	//this.tabPrdt.tabpBasic.form.divGroupId.form.cboGroupIdS.set_index(0);
	this.cboGroupIdS_onitemchanged(this.tabPrdt.tabpBasic.form.divGroupId.form.cboGroupIdS);
};

this.cboGroupIdS_onitemchanged = function(obj:nexacro.Combo,e:nexacro.ItemChangeEventInfo)
{
	var groupCodeStd = this.getGroupCode(obj.value, this.tabPrdt.tabpBasic.form.divGroupId.form.cboGroupIdM.value);
	this.fnSetPrdtGroupStandard(groupCodeStd, obj.value);
};

this.staPriceReg_onclick = function(obj:nexacro.Static,e:nexacro.ClickEventInfo)
{
	var prdtId = this.tabPrdt.tabpBasic.form.divPrdtId.form.edtPrdtId.value;
	var prdtNm = this.tabPrdt.tabpBasic.form.divPrdtNm.form.edtPrdtNm.value;
	var price1 = this.dsPrdtInfo.getColumn(0, "PRDT_PRICE1");
	var price2 = this.dsPrdtInfo.getColumn(0, "PRDT_PRICE2");
	var price3 = this.dsPrdtInfo.getColumn(0, "PRDT_PRICE3");
	
	var oArg = {
		PRDT_ID : prdtId,
		PRDT_NM : prdtNm,
		PRICE1 : price1,
		PRICE2 : price2,
		PRICE3 : price3,
		CALLBACK : "fnPriceCallback"
	};

	take.openPopup(this, "sbaPrdtPriceRegPopUp", "sba::sbaPrdtPriceRegPopUp.xfdl", oArg,"", 
	function(){
	});
};

this.fnPriceCallback = function(sPrice1, sPrice2, sPrice3)
{
//trace(this, "### fnPriceCallback : " + sPrice1 + ", " + sPrice2 + ", " + sPrice3);

	this.dsPrdtInfo.setColumn(0, "PRDT_PRICE1", sPrice1);
	this.dsPrdtInfo.setColumn(0, "PRDT_PRICE2", sPrice2);
	this.dsPrdtInfo.setColumn(0, "PRDT_PRICE3", sPrice3);
	this.setPriceDataset(sPrice1, sPrice2, sPrice3);
}

this.commonbtn_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
{
	var sBtnId = obj.name.substr(3);
//trace(this, "### commonbtn_onclick : " + sBtnId);
	switch(sBtnId){
		case 'New':
			this.dsPrdtInfo.clearData();
			this.fnInitMenu();
			this.fnTran("PrdtIdSelect");
			break;
		case 'Save':
			this.fnSave();
			break;
		default:
			break;
	}
};

this.divDetail_Button03_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
{
	var prdtId = this.tabPrdt.tabpBasic.form.divPrdtId.form.edtPrdtId.value;
	var prdtNm = this.tabPrdt.tabpBasic.form.divPrdtNm.form.edtPrdtNm.value;
	var oArg = {
		isPopup : true,
		PRDT_ID : prdtId,
		PRDT_NM : prdtNm,
		CALLBACK : "fnCallback"
	};
	/*
	take.openPopup(this, "PopUp", "sba::sbaPrdtMgrPopup.xfdl", oArg, "showtitlebar=true layered=true", 
					function(sId, sPrdtId, sErrMsg){

trace(this, "### sbaPrdtMgrPopup : " + sId + ", " + sPrdtId + ", " + sErrMsg);

			var sParam = solbar.getProjectParam();
			sParam = solbar.addParam(sParam, "PRDT_ID", sPrdtId);
			sParam = solbar.addParam(sParam, "PARENT_PRDT_ID", sPrdtId);
			
			take.transaction(this, "PrdtSelect", "SVC_LOC::prdt/select.do", "", "dsPrdtInfo=dsPrdtInfo dsPrdtSetList=dsPrdtSetList", sParam, "fnCallback");

					}, 
					false);
*/
	take.openPopup(this, "PopUp", "sba::sbaCustMgr.xfdl", oArg, "showtitlebar=true layered=true", 
					function(sId, sCustCd, sErrMsg){

trace(this, "### sbaCustMgr : " + sId + ", " + sCustCd + ", " + sErrMsg);
					}, 
					false);
};
