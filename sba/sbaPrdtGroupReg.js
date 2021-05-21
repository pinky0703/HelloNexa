/**
*  코드관리
* 
*  @MenuPath    시스템관리 > 코드관리 > 품목그룹등록
*  @FileName    SC030.xfdl 
*  @Creator     천우성
*  @CreateDate  2019.08.17 
*  @Version     1.0
*  @Desction    설명
* 
************** 소스 수정 이력 *************************************************
*    date          Modifier            Description
*******************************************************************************
*  2019.08.17      천우성             최초 생성 
*  2021.04.05      오지윤             화면 수정 및 C/U 수정
*  2021.04.27      박준서             조회 수정
*******************************************************************************
*/

//공통 라이브러리 호출

/*********************************************************
 * 1.1 FORM 변수 선언 영역
 ********************************************************/
//this.fv_nFormVal = null;     //용도
this.fv_sProjectCd = nexacro.getApplication().av_sProjectCd;
const ARR_STA_STANDARD = [this.dsStandard1.getColumn(0,"PRDT_STANDARD_NM1"),
						  this.dsStandard2.getColumn(0,"PRDT_STANDARD_NM2"),
						  this.dsStandard3.getColumn(0,"PRDT_STANDARD_NM3"),
						  this.dsStandard4.getColumn(0,"PRDT_STANDARD_NM4"),
						  this.dsStandard5.getColumn(0,"PRDT_STANDARD_NM5")];
/*********************************************************
* 1.2 FORM EVENT 영역(onload)
********************************************************/
/**
* formid_onload 최초 로드시 발생되는 이벤트 (필수)
*/
this.take_onload = function(obj:Form, e:nexacro.LoadEventInfo)
{
   if (take.formOnLoad(this)) //공통 온로드(필수) : 최초 온로드시 공통으로 호출되는 함수 --> 필수
   {
		take.tranCode(this, "00009", "dsUseYnCode", "ALL", 
			function (){
				this.tabSearch.tabSearchBasic.form.divSrch.form.cboUseYnSearch.set_index(0);
				this.fnTran('Group');
			}
		);
		this.fnTran('Standard');
		
		this.tabList.Tabpage1.form.grdCodeInfo.setCellProperty("body","col4","combodataset","dsStandard1"); 
		this.tabList.Tabpage1.form.grdCodeInfo.setCellProperty("body","col5","combodataset","dsStandard2"); 
		this.tabList.Tabpage1.form.grdCodeInfo.setCellProperty("body","col6","combodataset","dsStandard3"); 
		this.tabList.Tabpage1.form.grdCodeInfo.setCellProperty("body","col7","combodataset","dsStandard4"); 
		this.tabList.Tabpage1.form.grdCodeInfo.setCellProperty("body","col8","combodataset","dsStandard5"); 
		
		this.fnCommonCode();
		/* dsStandard1 에다가 공통 코드처럼 코드바인딩 */
		
   }
};
/* */ 
this.fnSetPrdtGroupStandard = function(sGroupId, sPrdtGroupId)
{
	var pcode;
	var ccode;
	for (var i = 0; i < ARR_STA_STANDARD.length; i++) {
		ARR_STA_STANDARD[i].set_visible(false);
		ARR_STA_STANDARD[i].standardCbo.set_visible(false);
	}
	for (var n = 0; n < this.dsPrdtGroupStandard.rowcount; n++) {

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
					//this.dsStandardGroup.filter();
					//sFilter = "PCODE.toString().indexOf('" + pcode + "') == 0 && CODE.toString().indexOf('" + ccode + "') == 0";
					//this.dsStandardGroup.filter(sFilter);
					ARR_STA_STANDARD[i].set_text(this.dsStandardGroup.getColumn(0, "NAME"));
					ARR_STA_STANDARD[i].standardCode = ccode;

					//규격별 데이터셋 할당
					//this.dsStandardGroup.filter();
					//sFilter = "PCODE.toString().indexOf('" + ccode + "0000') == 0";
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
 * @param  {String} sTranId 트랜잭션 아이디
 * @return {N/A}    N/A
 * @example this.fnTran("ID");
 */
this.fnTran = function(sTranId)
{
    //공통 조회에서 호출할 디폴트값 세팅 필요
    if (take.nvl(sTranId, "")=="") sTranId = "Group";
    
    //변수선언
    var sUrl   = "",      //서비스 URL
        sInDs  = "",      //데이터셋을 검색조건으로 보낼경우 사용 -->선택
        sOutDs = "",      //데이터를 받아올 데이터셋 지정
        sParam = solbar.getProjectParam(),      //파라메터 사용 안 할 경우       
        sCallBack = "";        //콜백 처리 함수

    sCallBack  = "fnCallback" ; 
    
    switch(sTranId)
    {
        case "Group" :  
			this.dsPrdtGroup.clearData(); 
			var sCodeNm = take.nvl(this.tabSearch.tabSearchBasic.form.divSrch.form.edtAllSearch.value, "");
			var sParam = solbar.getProjectParam();
            sParam  += " PRDT_GROUP_NM='" + sCodeNm + "' USE_YN='" + this.tabSearch.tabSearchBasic.form.divSrch.form.cboUseYnSearch.value + "'";
			take.tranSelect(this, "Group", "PrdtGroup.prdtGroupCode", "", "dsPrdtGroup", sParam, sCallBack);
            break;
	
		case "List" :  // 품목규격 2depths
			this.dsCodeInfo.clearData();
			this.dsMultiLanguageDetail.clearData();
			
			var nRow      	= this.dsPrdtGroup.rowposition;
			var sParentKey 	= this.dsPrdtGroup.getColumn(nRow, "GROUP_ID");
			var sGroupId	= this.dsPrdtGroup.getColumn(nRow, "PRDT_GROUP_ID");
			var sParam		= solbar.getProjectParam();
// 			if(sParentKey=='00000000')
// 				sParam     		+= " PARENT_KEY='" + sGroupId + sParentKey.substring(0,4)+  "0000'";
// 			else
				sParam     		+= " PARENT_KEY='" + sParentKey.substring(4)+ sGroupId + "0000'";
            take.tranSelect(this, "List", "PrdtGroup.prdtGroupList", "", "dsCodeInfo", sParam, sCallBack);
            break;
			
		case "Language" :
			this.dsMultiLanguageDetail.clearData();
			var nRow  = this.dsCodeInfo.rowposition;
			var sMlCd = take.nvl(this.dsCodeInfo.getColumn(nRow, "ML_CD"), "");
			take.tranSelect(this, "Language", "SystemCommon.multilanguageDetailList", "", "dsMultiLanguageDetail", "sMlCd='" + sMlCd + "'", sCallBack);
			break;
			
		case "Save" :
			take.tranSave(this, "Save", "PrdtGroup.prdtGroup", "dsCodeInfo", "", "", sCallBack);
            break;
			
		case "Standard": /* 여기 !!! */
			this.dsPrdtGroupStandard.clearData();
			// sParam = solbar.addParam(sParam, "USE_YN", "Y");
			// sParam += " PCODE='" +this.dsPrdtGroupStandard.getColumn(nRow, "PCODE")+"'";// 클릭한 로우값 넘겨주기 
			// if(sParentKey=='000000000000')
				take.tranSelect(this, "Standard", "PrdtGroupStandard.prdtGroupStandardSelect", "", "dsPrdtGroupStandard", sParam, sCallBack); 
            break;
        default :
            break;
    }
};
this.fnCommonCode = function ()
{
	//공통코드
    var sOutDs      = ["dsUseYnCode" ];
    var sGroupCodes = ["00009"		];
    var sHeaderType = ["SEL"		];
	//프로젝트별 공통코드
	var sProjectOutDs      = ["dsStandard1" , "dsStandard2", "dsStandard3" , "dsStandard4", "dsStandard5"];
    var sProjectGroupCodes = ["0001"		,"0003"			,"0003"			,"0003"			,"0003"		];
    var sProjectHeaderType = ["SEL"];		// "SEL" : 선택 표시
	var sAddParam = "prdtGroupCodeSearch=dsStandard1 prdtGroupStandardSelect=dsPrdtGroupStandard";
//take.debug(this, "### solbar.tranProjectCode.sGroupCodes : " + sGroupCodes);
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
		
			//품목소그룹별 규격 1~5
			for (var n = 0; n < this.dsPrdtGroupStandard.rowcount; n++) {
trace(this, "### dsPrdtGroupStandard [" + n + "] " + 
				this.dsPrdtGroupStandard.getColumn(n, "GROUP_ID") + ", " + 
				this.dsPrdtGroupStandard.getColumn(n, "PRDT_GROUP_ID") + ", " + 
				this.dsPrdtGroupStandard.getColumn(n, "PRDT_STANDARD_GROUP_ID1") + ", " + 
				this.dsPrdtGroupStandard.getColumn(n, "PRDT_STANDARD_ID1") + ", " + 
				this.dsPrdtGroupStandard.getColumn(n, "PRDT_STANDARD_NM1"));
			}
			this.fnTran('List');
			this.fnSetPrdtGroupStandard(this.dsPrdtGroup.getColumn(0, "GROUP_ID"), this.dsPrdtGroup.getColumn(0, "PRDT_GROUP_ID"));
			//this.fnInitMenu();

        },
		false
	);
	
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
        case "Group" : //코드그룹 콜백
			var sCodeNm = this.tabSearch.tabSearchBasic.form.divSrch.form.edtAllSearch.value;
			var sUseYn = this.tabSearch.tabSearchBasic.form.divSrch.form.cboUseYnSearch.value;
			if(!take.isEmpty(sCodeNm) || !take.isEmpty(sUseYn)){
				this.tabSearch.tabSearchBasic.form.grdCodeGroup.selectRow(1);
			}
			this.fnTran('List');
            break;
			
        case "List" :  //코드목록 콜백
            this.fnTran('Language');
            break;
	
			
        case "Save" : //저장 콜백
			this.reload();
            //this.fnTran('Group');
            break;
			
		case "Standard" :  
			var objGrid, objDs;
			var sStandard1, sStandard2, sStandard3, sStandard4, sStandard5;
			var nIdx;
			
			objGrid = this.tabList.Tabpage1.form.grdCodeInfo;
			objDs = this.dsCodeInfo;
			nIdx =  objGrid.getBindCellIndex("body","PRDT_STANDARD_GROUP_ID1"); // nIdx = 5

		/*	if (this.dsStandard.rowcount > 0)*/
			objGrid.setCellProperty("body",nIdx,"text",sStandard1); // 콤보박스 설정 
			objGrid.setCellProperty("body",nIdx+1,"text",sStandard2); 
			objGrid.setCellProperty("body",nIdx+2,"text",sStandard3); 
			objGrid.setCellProperty("body",nIdx+3,"text",sStandard4); 
			objGrid.setCellProperty("body",nIdx+4,"text",sStandard5); 
				
			this.fnTran('List');
			// this.fnTran('UserSelect');
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
    if (take.nvl(sTranId, "")=="") sTranId = "Group";
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
    if (take.nvl(sTranId, "")=="") sTranId = "Save";
	var objDs     = this.dsCodeInfo;
	
	// 벨리데이션	
// 	var arrFindNm    = take.nvl(take.getFindRows(objDs, "PRDT_GROUP_NM", ""), "");
 	var arrFindOrder = take.nvl(take.getFindRows(objDs, "CODE_ORDER", ""), "");
// 	var arrFindId 	 = take.nvl(take.getFindRows(objDs, "PRDT_GROUP_ID", ""), "");
	var prdtGroupNm = objDs.getColumn(0, "PRDT_GROUP_NM");
 	var prdtGroupId = objDs.getColumn(0, "PRDT_GROUP_ID");
	
	// 	규격 타입 
	// 	var arrFindStandardGId		=  take.getFindRows(this.dsStandard, "PRDT_STANDARD_GROUP_ID1", "");// 배열 형태로 반환
	// 	var arrFindStandardNm	=  take.getFindRows(this.dsStandard, "PRDT_STANDARD_NM1", "");
	var prdtGroupStandardNm = take.getFindRows(this.dsStandard, "PRDT_STANDARD_NM1", "");
	var prdtGroupStandardId = take.getFindRows(this.dsStandard, "PRDT_STANDARD_GROUP_ID1", "");
	
	if(prdtGroupId.length > 0) {
		take.alert(this, "info", "코드ID를 입력해주세요.");
		return;
	}
	if(prdtGroupNm.length > 0) {
		take.alert(this, "info", "코드명을 입력해주세요.");
		return;
	}
	if(arrFindOrder.length > 0) {
		take.alert(this, "info", "정렬순서를 입력해주세요.");
		return;
	}
	
   //  this.fnTran("Save");
	var sParam = "PRDT_GROUP_NM='"+ arrFindNm +"' CODE_ORDER='" + arrFindOrder + "' PRDT_GROUP_ID='" + arrFindId + "' PRDT_STANDARD_ID1='" + prdtGroupStandardId +"'";
	// take.transaction(this, "Save", "SVC_LOC::um/userSave.do", "dsUserDetail=dsUserDetail:U dsFile=dsFile:U", "dsUserDetail=dsUserDetail", sParam, "fnCallback");
	take.tranSave(this, "Save", "PrdtGroup.prdtGroup", "dsCodeInfo", "", "", sCallBack);
};

/**
 * fnAddRow : 행 추가 함수 (필수)--> 공통 행추가에서 호출할 디폴트값 세팅 필요
 * @param  {String} sGridId 그리드 아이디
 * @param  {Number} nRow    addRow 리턴값(추가된 행 위치)
 * @example this.fnAddRow(sGrdId, nRow);
 */
this.fnAddRow = function(sGrdId, nRow)
{
	var sParentKey, sGroupId, sPrdtGroupId;
	
	//현재 리스트에 데이터가 있으면
	if ( this.dsCodeInfo.rowcount > 0 )
	{
		//같은 레벨임으로 같은 그룹 아이디를 가져다 씀
		sParentKey = this.dsCodeInfo.getColumn(0, "PARENT_KEY");
		sGroupId   = this.dsCodeInfo.getColumn(0, "GROUP_ID");
	} else {  
		//없을경우 코드그룹 리스트에서 현재 선택된 Row의 코드 아이디를 가져옴
		sPrdtGroupId = this.dsPrdtGroup.getColumn(this.dsPrdtGroup.rowposition, "PRDT_GROUP_ID"); 
		sGroupId   = this.dsPrdtGroup.getColumn(this.dsPrdtGroup.rowposition, "GROUP_ID").substring(4)+sPrdtGroupId;
		sParentKey = sGroupId+'0000'; 
	}
	
	var nRow = this.dsCodeInfo.addRow();
	this.dsCodeInfo.setColumn(nRow, "PRDT_GROUP_ID", "자동생성");
	this.tabList.Tabpage1.form.grdCodeInfo.setCellPos(2);
	this.tabList.Tabpage1.form.grdCodeInfo.setFocus();

	
	//기본 값 세팅(그룹아이디, 사용여부)
	var nMaxOrder = parseInt(this.dsCodeInfo.getMax("CODE_ORDER")+1);
	this.dsCodeInfo.setColumn(nRow, "CODE_ORDER", take.nvl(nMaxOrder, "99"));
	this.dsCodeInfo.setColumn(nRow, "PROJECT_CD"   	,this.fv_sProjectCd);
	this.dsCodeInfo.setColumn(nRow, "PRDT_GROUP_NM"   	, "");
	this.dsCodeInfo.setColumn(nRow, "PARENT_KEY", sParentKey);
	this.dsCodeInfo.setColumn(nRow, "GROUP_ID", sGroupId);
	this.dsCodeInfo.setColumn(nRow, "USE_YN", "Y");
	
	//신규 코드임으로 다국어 데이터 Clear
	this.dsMultiLanguageDetail.clearData();
	
};
/**
 * fnDelRow : 행 삭제 함수 (필수) --> 공통 행삭제에서 호출할 디폴트값 세팅 필요
 * @param  {String} sGridId 그리드 아이디
 * @param  {Number, Array} arrnRow    deleteRow 리턴값
 * @return {N/A} N/A
 * @example this.fnDelRow(sGrdId, nRow); 
 */
this.fnDelRow = function(sGrdId, arrnRow)
{    
    //공통 행추가에서 호출할 디폴트값 세팅
    if (take.nvl(sGrdId, "")=="") sGrdId = "grdCodeInfo";
    
    var objDataset = this.dsCodeInfo;
    var arrChkRow = take.getChkRow(objDataset);
    
    if(arrChkRow.length == 0){
        alert("선택된 항목이 없습니다.");
        return;
    }
    
    var bRowDel = take.confirm(this, "question", "선택된 항목(들)을 삭제 하시겠습니까?");
    if (bRowDel){
        for(var i=0; i<arrChkRow.length; i++) {
            objDataset.deleteRow(arrChkRow[i]);
        }
        this.fnTran("Save");
    }

	
};

/*********************************************************
 * 4 각 COMPONENT 별 EVENT 영역
  ********************************************************/
//그룹 리스트 클릭이벤트
this.divDetail_grdCodeGroup_oncellclick = function(obj:nexacro.Grid,e:nexacro.GridClickEventInfo)
{
	if(e.clickitem == "") 
    {        
        var objGrid, objDs;
        var sRef1, sRef2, sRef3;
        var nIdx;
        
        objGrid = this.tabList.Tabpage1.form.grdCodeInfo;        
        objDs = this.dsPrdtGroup;
        
//         sRef1 = take.nvl(objDs.getColumn(e.row,"REF1"), "Ref.1");
//         sRef2 = take.nvl(objDs.getColumn(e.row,"REF2"), "Ref.2");
//         sRef3 = take.nvl(objDs.getColumn(e.row,"REF3"), "Ref.3");
//         
//         nIdx = objGrid.getBindCellIndex("body","REF1");
//         
//         objGrid.setCellProperty("head",nIdx,"text",sRef1);
//         objGrid.setCellProperty("head",nIdx+1,"text",sRef2);
//         objGrid.setCellProperty("head",nIdx+2,"text",sRef3);
        this.fnSearch('List');
    }
};

// 엔터 입력시 다음 편집 셀로 이동
this.divDetail_grdCodeInfo_onenterdown = function(obj:nexacro.Grid,e:nexacro.GridEditEventInfo)
{
	obj.moveToNextCell();
};

// 코드그룹 검색조건 엔터 값 조회
this.divSearch_edtCodeInfoSearch_onkeyup = function(obj:nexacro.Edit,e:nexacro.KeyEventInfo)
{
	if(e.keycode == 13){
		// this.fnTran("Group");
		this.fnTran("Group");
	}
};
/*********************************************************
* 5 사용자 FUNCTION 영역
********************************************************/
/**
 * fnPopCallback : 다국어팝업 콜백
 * @example this.fnPopCallback();
 */
this.fnPopCallback = function (sId, nReturnVal)
{
	//팝업이 닫히면서 nReturnVal을 통해 값을 받을 수 있습니다
	var nRow = this.dsCodeInfo.rowposition;
	if(take.nvl(nReturnVal, "") != "") {
		nReturnVal = nReturnVal.split(",")[0];
		this.dsCodeInfo.setColumn(nRow, "ML_CD", nReturnVal);
	} else return;
	
	this.fnTran("Language");
};


this.divSearch_btnSearch_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
{
	this.fnTran("Group");
};

this.tabSearch_tabSearchBasic_divSrch_edtAllSearch_onkeyup = function(obj:nexacro.Edit,e:nexacro.KeyEventInfo)
{
	if(e.keycode == 13){
		this.fnTran("Group");
	}
};

/*
 * 규격 구분이 이미 선택된 항목이면 이미 선택된 항목이라고 표시해주기 
 * cancolumnchange : dataset의 Column값이 변경될 때 발생하는 이벤트 
 */
this.dsCodeInfo_cancolumnchange = function(obj:nexacro.NormalDataset,e:nexacro.DSColChangeEventInfo)
{	
	// dsPrdtGroupStandard에 품목규격 바인딩 시키기 
	
	var nRow = this.dsCodeInfo.rowposition;
	this.dsCodeInfo.setColumn(nRow,"PRDT_STANDARD_GROUP_ID1",this.dsPrdtGroupStandard.getColumn(0,"PRDT_STANDARD_ID1"));
	this.dsCodeInfo.setColumn(nRow,"PRDT_STANDARD_GROUP_ID2",this.dsPrdtGroupStandard.getColumn(0,"PRDT_STANDARD_ID2"));
	this.dsCodeInfo.setColumn(nRow,"PRDT_STANDARD_GROUP_ID3",this.dsPrdtGroupStandard.getColumn(0,"PRDT_STANDARD_ID3"));
	this.dsCodeInfo.setColumn(nRow,"PRDT_STANDARD_GROUP_ID4",this.dsPrdtGroupStandard.getColumn(0,"PRDT_STANDARD_ID4"));
	this.dsCodeInfo.setColumn(nRow,"PRDT_STANDARD_GROUP_ID5",this.dsPrdtGroupStandard.getColumn(0,"PRDT_STANDARD_ID5"));
	
// 	if (e.columnid == "PRDT_STANDARD_GROUP_ID1"){
// 		var findRow = this.dsCodeInfo.findRowExpr("PRDT_STANDARD_GROUP_ID1=='" + e.newvalue + "'");
// 		if (findRow >= 0) {
// 			alert("중복된 부가 존재 합니다.");
// 			return false;   // <--이 false로 인해 사용자가 선택한 값이 취소가 됨
// 		}
// 	}
};
