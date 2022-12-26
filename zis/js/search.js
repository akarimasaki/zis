var MAX_VIEW_ITEM = 6;
var WINDOW_WIDTH = window.innerWidth;
// MAX_VIEW_ITEM をレスポンシブ対応させる関数
function changeMaxItem() {
	if (window.matchMedia('(max-width:768px)').matches) {
		MAX_VIEW_ITEM = 4; // 画面が小さいとき
	} else if (window.matchMedia('(min-width:769px)').matches) {
		MAX_VIEW_ITEM = 6; // 画面が大きいとき
	}
}

// ページサイズが変更されたときに動作する関数
// ※注意
// スマートフォンではスクロールすると画面サイズは変わる
window.onresize = function () {
	if (WINDOW_WIDTH == window.innerWidth) {
		return;
	}
	WINDOW_WIDTH = window.innerWidth;
	changeMaxItem();
	var viewMoreButtons = document.getElementsByClassName('viewMoreContents');
	if (!!viewMoreButtons) {
		for (var i = 0; i < viewMoreButtons.length; i++) {
			var buttonId = viewMoreButtons[i].id;
			var boxName = buttonId.substring("viewMore".length, buttonId.length);
			innerCloseContents("close" + boxName);
		}
	}
}

// ----------------------------------------------------
// ページが開かれたときに動作する関数
// ----------------------------------------------------
// チェックボックスが操作されたときに動作するイベントハンドラを設定している。
// チェックボックスのグループごとに ここから ～ ここまで の範囲のコードを書く。
// チェックボックスのグループの名前は index.html で定義している。
// 例）　filter-support, filter-sector
// チェックボックスのグループを増やす場合は、既存の ここから ～ ここまで　をコピー＆ペーストして、
// filter-xxx の xxx を書き換えるだけでも使える。
// function filterList() の中も変更。
window.onload = function () {
	changeMaxItem();
	var widget = document.getElementById('filter-condition');
	var checkboxes = null;

	// 事例表示に関する処理
	if (!!widget) {
		// ここから filter-support
		checkboxes = widget.querySelectorAll('.filter-support input[type="checkbox"]');
		for (var i = 0; i < checkboxes.length; i++) {
			checkboxes[i].addEventListener('change', filterList);
		}
		// ここまで

		// ここから filter-sector
		checkboxes = widget.querySelectorAll('.filter-sector input[type="checkbox"]');
		for (var i = 0; i < checkboxes.length; i++) {
			checkboxes[i].addEventListener('change', filterList);
		}
		// ここまで

		document.getElementById('viewMoreCaseList').onclick = viewMoreCaseList;
		document.getElementById('closeCaseList').onclick = closeCaseList;
	}

	// コンテンツ表示に関する処理
	var viewMoreButtons = document.getElementsByClassName('viewMoreContents');
	if (!!viewMoreButtons) {
		for (var i = 0; i < viewMoreButtons.length; i++) {
			viewMoreButtons[i].onclick = viewMoreContents;
		}
	}
	var closeButtons = document.getElementsByClassName('closeContents');
	if (!!closeButtons) {
		for (var i = 0; i < closeButtons.length; i++) {
			closeButtons[i].onclick = closeContents;
			innerCloseContents(closeButtons[i].id);
		}
	}
	closeCaseList();
}

// ----------------------------------------------------
// チェックボックスを操作したときに動作するイベントハンドラ
// ----------------------------------------------------
// チェックボックスの状態ごとに導入事例リストの表示設定を変更する関数を呼んでいる。
// チェックボックスのグループごとに ここから ～ ここまで の範囲のコードを書く。
// チェックボックスのグループの名前は index.html で定義している。
// 例）　filter-support, filter-sector
// チェックボックスのグループを増やす場合は、既存の ここから ～ ここまで　をコピー＆ペーストして、
// filter-xxx 及び data-filter-xxx-view の xxx を書き換えるだけでも使える。
// window.onload = function() の中も変更。
function filterList() {
	var widgetList = document.getElementById('filter-list');
	if (!!widgetList) {
		var lists = widgetList.querySelectorAll('.caselist');
		var checkboxes = null;

		var widgetCondition = document.getElementById('filter-condition');
		if (!!widgetCondition) {
			// ここから filter-support
			checkboxes = widgetCondition.querySelectorAll('.filter-support input[type="checkbox"]');
			if (isChecked(checkboxes)) {
				switchViewList(lists, checkboxes, 'data-filter-support-view');
			}
			else {
				switchAllViewListToOn(lists, 'data-filter-support-view');
			}
			// ここまで

			// ここから filter-sector	
			checkboxes = widgetCondition.querySelectorAll('.filter-sector input[type="checkbox"]');
			if (isChecked(checkboxes)) {
				switchViewList(lists, checkboxes, 'data-filter-sector-view');
			}
			else {
				switchAllViewListToOn(lists, 'data-filter-sector-view');
			}
			// ここまで
		}
	}

	closeCaseList();
}

// ----------------------------------------------------
// 同じグループ内のチェックボックスがひとつでもチェックされているか確認する関数
// ----------------------------------------------------
// ひとつでもチェックされていれば true を返す。
// ひとつもチェックされていなければ false を返す。
function isChecked(checkboxes) {
	for (var i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			return true;
		}
	}
	return false;
}

// ----------------------------------------------------
// 導入事例リストの表示設定をすべて on にする関数
// ----------------------------------------------------
// 指定されたチェックボックスのグループについて、
// 導入事例リストの表示設定をすべて表示に設定する。
// 他のチェックボックスのグループの設定によって、実際に表示されるかどうかは変わる。
function switchAllViewListToOn(lists, attrNameForSwitchView) {
	for (i = 0; i < lists.length; i++) {
		lists[i].setAttribute(attrNameForSwitchView, 'on');
	}
}

// ----------------------------------------------------
// 指定されたチェックボックスのグループでチェックされたキーワードに従って
// 導入事例リストの表示設定を on にする関数
// ----------------------------------------------------
// 導入事例リストごとに設定されたキーワード群の中に、
// チェックボックスでチェックされたキーワードが含まれているか確認して、
// 含まれていれば、その導入事例リストの表示設定を on にする。
// ひとつも含まれていなければ off にする。
// 他のチェックボックスのグループの設定によって、実際に表示されるかどうかは変わる。
function switchViewList(lists, checkboxes, attrNameForSwitchView) {
	for (var i = 0; i < lists.length; i++) {
		var keys = lists[i].getAttribute('data-filter-key');
		lists[i].setAttribute(attrNameForSwitchView, 'off');
		for (var j = 0; j < checkboxes.length; j++) {
			if (checkboxes[j].checked) {
				if (keys.indexOf(checkboxes[j].value) >= 0) {
					lists[i].setAttribute(attrNameForSwitchView, 'on');
					continue;
				}
			}
		}
	}
}

// ----------------------------------------------------
// コンテンツを MAX_VIEW_ITEM 件までしか表示しないように変更する関数
// onclick登録用
// ----------------------------------------------------
// イベントが発生したボタンを認識して動作する
function closeContents(e) {
	var e = e || window.event;
	var elem = e.target || e.srcElement;
	var elemId = elem.id;
	innerCloseContents(elemId);
	scrollToViewMoreBtn(elemId, -500);
}

// ----------------------------------------------------
// Closeボタンに対応したViewMoreボタンの上までスクロールする関数
// ----------------------------------------------------
// CloseボタンのIDを指定
// offset分だけスクロール位置をずらす（正の値なら下方向、負の値なら上方向）
function scrollToViewMoreBtn(elemId, offset) {
	var boxName = elemId.substring("close".length, elemId.length);
	var elem = document.getElementById('viewMore' + boxName);

	var clientRect = elem.getBoundingClientRect();
	var y = clientRect.top + offset;
	// scrollBy(0,y);
	scrollBy({
		left: 0,
		top: y,
		behavior: "smooth",
	});
}


// ----------------------------------------------------
// コンテンツを MAX_VIEW_ITEM 件までしか表示しないように変更する関数
// ----------------------------------------------------
// すべてのコンテンツを
function closeAllContents() {
	var closeButtons = document.getElementsByClassName('closeContents');
	for (var i = 0; i < closeButtons.length; i++) {
		innerCloseContents(closeButtons[i].id);
	}

}

// ----------------------------------------------------
// コンテンツを MAX_VIEW_ITEM 件までしか表示しないように変更する関数
// ----------------------------------------------------
// 任意のボタンに対応したコンテンツグループ（contents box種別）を
// MAX_VIEW_ITEM 件までしか表示しないように変更する
function innerCloseContents(buttonId) {
	var boxName = buttonId.substring("close".length, buttonId.length);

	var lists = document.getElementsByClassName(boxName);
	var count = 0;
	for (var i = 0; i < lists.length; i++) {
		if (count < MAX_VIEW_ITEM) {
			lists[i].style.display = 'block';
		}
		else {
			lists[i].style.display = 'none';
		}
		count++;
	}
	document.getElementById('viewMore' + boxName).style.display = 'block';
	document.getElementById('close' + boxName).style.display = 'none';
}

// ----------------------------------------------------
// コンテンツを全件表示されるように変更する関数
// onclick登録用
// ----------------------------------------------------
// イベントが発生したボタンを認識して動作する
function viewMoreContents(e) {
	var e = e || window.event;
	var elem = e.target || e.srcElement;
	var elemId = elem.id;
	innerViewMoreContents(elemId);
}

// ----------------------------------------------------
// コンテンツを全件表示されるように変更する関数
// ----------------------------------------------------
// 任意のボタンに対応したコンテンツグループ（contents box種別）を
// MAX_VIEW_ITEM 件までしか表示しないように変更する
function innerViewMoreContents(buttonId) {
	var boxName = buttonId.substring("viewMore".length, buttonId.length);

	var list = document.getElementsByClassName(boxName);
	var arrayOfList = Array.from(list);
	var current_list = arrayOfList.filter(n => n.style.display == 'block');
	var disp_length = current_list.length + MAX_VIEW_ITEM;

	if (disp_length < list.length) {
		document.getElementById('viewMore' + boxName).style.display = 'block';
		document.getElementById('close' + boxName).style.display = 'none';
	} else {
		disp_length = list.length;
		document.getElementById('viewMore' + boxName).style.display = 'none';
		document.getElementById('close' + boxName).style.display = 'block';
	}

	for (var i = 0; i < disp_length; i++) {
		list[i].style.display = 'block';
	}
}

// ----------------------------------------------------
// 事例を MAX_VIEW_ITEM 件までしか表示しないように変更する関数
// ----------------------------------------------------
function closeCaseList(e) {
	var e = e || window.event;
	var elem = e.target || e.srcElement;
	var elemId = elem.id;
	innerCloseCaseList();
	scrollToViewMoreBtn(elemId, -900);
}
function innerCloseCaseList() {
	var widgetList = document.getElementById('filter-list');
	var lists = widgetList.querySelectorAll('.caselist');
	var count = 0;
	for (var i = 0; i < lists.length; i++) {
		var supportKey = lists[i].getAttribute('data-filter-support-view');
		var sectorKey = lists[i].getAttribute('data-filter-sector-view');
		if (supportKey != 'off' && sectorKey != 'off') {
			if (count < MAX_VIEW_ITEM) {
				lists[i].setAttribute('data-filter-count-view', 'on');
			}
			else {
				lists[i].setAttribute('data-filter-count-view', 'off');
			}
			count++;
		}
		else {
			lists[i].setAttribute('data-filter-count-view', 'off');
		}
	}
	if (count > MAX_VIEW_ITEM) {
		document.getElementById('viewMoreCaseList').style.display = 'block';
		document.getElementById('closeCaseList').style.display = 'none';
	}
	else {
		document.getElementById('viewMoreCaseList').style.display = 'none';
		document.getElementById('closeCaseList').style.display = 'none';
	}

	document.getElementById('searchResultNumber').innerText = count + "件";
}

// ----------------------------------------------------
// 事例を全件表示されるように変更する関数
// ----------------------------------------------------
function viewMoreCaseList() {
	var widgetList = document.getElementById('filter-list');
	var lists = widgetList.querySelectorAll('.caselist');
	for (var i = 0; i < lists.length; i++) {
		lists[i].setAttribute('data-filter-count-view', 'on');
	}
	document.getElementById('viewMoreCaseList').style.display = 'none';
	document.getElementById('closeCaseList').style.display = 'block';
}
