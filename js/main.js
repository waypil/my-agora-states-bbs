

/*
* 명령어는 대소문자를 가리지 않습니다 *

-- 기본 명령어 --
I : 초기 화면(메인 화면)
X : 이전 메뉴(상위 메뉴)로 이동
R : 새로고침
H : 도움말

-- 게시판 명령어 --
 P : 페이지로 이동 (예: P1)
WQ : 질문 새로 쓰기
EQ : 질문 수정하기
DQ : 질문 삭제하기
WA : 답변 새로 쓰기
EA : 답변 수정하기
DA : 답변 삭제하기
 N : 다음 페이지
 B : 이전 페이지

-- 기타 조작 --
↑ : 위로 스크롤
↓ : 아래로 스크롤
*/

const $form = $('form')[0];
const $cmd = $('#command')[0];
const $qContainer = $('#questions-container')[0];

const $spanCurrentPageNum = $('span.current-page-number')[0];
const $spanAllPagesNum = $('span.all-pages-number')[0];
const $spanAllQCount = $('span.all-question-count')[0];

$form.addEventListener('submit', (e) => {
    const cmd = $cmd.value.toUpperCase();  // 사용자가 입력한 명령어

    if (cmd[cmd.length - 1] === 'P' && cmd.length >= 2 && !isNaN(num = Number(cmd.slice(0, -1)))) {
        goPage(num);  // 페이지로 이동 (예: 2p)
    } else if (!isNaN(num = Number(cmd))) {
        // openQ(num) // 해당 순서의 게시물 열기 (예: 7)
    } else {
        switch (cmd) {
            case 'H':  // 도움말
                break;
            case 'X':  // 모달창(팝업창) 닫기
                break;
            case 'WQ':  // 질문 새로 쓰기
                break;
            case 'EQ':  // 질문 수정하기
                break;
            case 'DQ':  // 질문 삭제하기
                break;
            case 'WA':  // 답변 새로 쓰기
                break;
            case 'EA':  // 답변 수정하기
                break;
            case 'DA':  // 답변 삭제하기
                break;
            case 'N':  // 다음 페이지
                goNextPage();
                break;
            case 'P':  // 이전 페이지
                goPrevPage();
                break;
            default:
                '잘못된 명령어가 입력되었습니다. (도움말: H)';
        }
    }
    $cmd.value = '';
})

function goPage(num) {
    render($qContainer, qSimpleList, num);
    $spanCurrentPageNum.textContent = num;
}
function goNextPage() {
    const nextNum = Number($spanCurrentPageNum.textContent) + 1;
    const maxNum = Number($spanAllPagesNum.textContent);
    if (nextNum <= maxNum) {
        goPage(nextNum);
    }
}
function goPrevPage() {
    const prevNum = Number($spanCurrentPageNum.textContent) - 1;
    if (prevNum >= 1) {
        goPage(prevNum);
    }
}


const qSimpleList = [];
const qFullList = [];

const convertToDiscussion = (qObj) => {
    convertQSimple(qObj);
    convertQFull(qObj);
};
function convertQSimple(qObj) {
    const elSimpleArticle = document.createElement("article");  // 최상단 (틀)
    elSimpleArticle.classList.add('simple');
    const elSimpleIndex = document.createElement("section");  // 번째 (틀만)
    elSimpleIndex.classList.add('index');
    const elSimpleTitle = document.createElement("section");  // 제목 (틀)
    elSimpleTitle.classList.add('title');
    const elSimpleTitleText = document.createElement("p");  // 제목
    elSimpleTitleText.textContent = qObj.title;
    const elSimpleACount = document.createElement("section");  // 답변수 (틀)
    elSimpleACount.classList.add('answer-count');
    const elSimpleACountText = document.createElement("p");  // 답변수
    elSimpleACountText.textContent = Number(qObj.answer !== null);

    elSimpleTitle.append(elSimpleTitleText);
    elSimpleACount.append(elSimpleACountText);
    elSimpleArticle.append(elSimpleIndex, elSimpleTitle, elSimpleACount);
    qSimpleList.push(elSimpleArticle);

    return elSimpleArticle;
}
function convertQFull(qObj) {
    const elArticle = document.createElement("article"); // 최상단 (틀)
    const elA = document.createElement("a");
    const elImg = document.createElement("img");
    const elP = document.createElement("p");

    elArticle.classList.add('full');
    elA.setAttribute('target', "_blank");
    elImg.classList.add('profile');
    elImg.setAttribute('src', qObj.avatarUrl);  // 질문자 프사 설정
    elImg.setAttribute('alt', 'Avatar of Questioner');
    elP.textContent = qObj.title;

    elArticle.append(elA);
    elA.append(elImg, elP);
    qFullList.push(elArticle);

    return elArticle;

}

function render(container, qList, startPageNum = 1) {
    container.innerHTML = '';
    const startIndex = (startPageNum - 1) * 10;
    const endIndex = startIndex + 10;
    for (let i = startIndex; i < endIndex; i++) {
        if (question = qList[i]) {
            container.append(question);
        }
    }
    return;
};


/* INIT */

for (let i = 0; i < agoraStatesDiscussions.length; i++) {
    convertToDiscussion(agoraStatesDiscussions[i]);
}

$spanCurrentPageNum.textContent = 1;
$spanAllPagesNum.textContent = Math.ceil(qFullList.length / 10);
$spanAllQCount.textContent = qFullList.length;

render($qContainer, qSimpleList);  // agoraStatesDiscussions 배열의 모든 요소를 화면에 렌더링합니다.