let moon = document.querySelector('.moon');
let backgroundVideo = document.querySelector('#background-video');
let particles = document.querySelector('#particles-js');
let sun = document.querySelector('.sun');
let hiddenText = document.querySelector('.hidden');  // 해당 텍스트 요소
let hiddenTextContent = document.querySelector('.hidden-text');
let snowman = document.createElement('img'); // Snowman 이미지 생성
snowman.src = 'images/snowman.png'; // Snowman 이미지 경로
snowman.classList.add('snowman'); // snowman 클래스 추가
let grass = document.createElement('img'); // Grass 이미지 생성
grass.src = 'images/grass.png'; // Grass 이미지 경로
grass.classList.add('grass'); // grass 클래스 추가
let isMouseDown = false;
let offsetX, offsetY;

let initialBgColor = "#2c3e50"; // 밤하늘
let finalBgColor = "#f39c12"; // 아침 해
let dayBgColor = "#b1e1e2"; // 아침 하늘 색상
let finalBgColorAfterSnowman = "#b9e67f"; // 눈사람 고정 시 배경 색상

moon.style.transition = "left 0.1s ease-out, top 0.1s ease-out, opacity 1s ease-out";

moon.addEventListener('mousedown', function (e) {
    isMouseDown = true;
    offsetX = e.clientX - moon.offsetLeft;
    offsetY = e.clientY - moon.offsetTop;
});

document.addEventListener('mousemove', function (e) {
    if (isMouseDown) {
        let leftPosition = e.clientX - offsetX;
        let maxLeft = window.innerWidth / 2 - moon.offsetWidth;
        if (leftPosition < 0) leftPosition = 0;
        if (leftPosition > maxLeft) leftPosition = maxLeft;

        moon.style.left = leftPosition + 'px';
        moon.style.top = (e.clientY - offsetY) + 'px';

        let colorRatio = leftPosition / maxLeft;

        // 배경색 변환
        document.body.style.background = interpolateColors(initialBgColor, finalBgColor, colorRatio);

        moon.style.opacity = 1 - colorRatio; // 달이 사라짐

        // 비디오가 서서히 사라지도록 처리
        if (colorRatio > 0.5) {
            backgroundVideo.style.opacity = 0; // 밝아지면 비디오가 사라짐
        } else {
            backgroundVideo.style.opacity = 1; // 어두우면 비디오가 나타남
        }

        // 글씨가 나타나는 시점
        if (colorRatio > 0.5) {
            hiddenTextContent.style.opacity = 1; // 텍스트 나타남
        } else {
            hiddenTextContent.style.opacity = 0; // 텍스트 사라짐
        }

        // 아침 하늘로 바뀌면 요소들을 지우고 <p class="hidden"> 텍스트 표시
        if (colorRatio >= 1) {
            document.querySelector('.moon').style.display = 'none';
            document.querySelector('.building').style.display = 'none';
            document.querySelector('h1').style.display = 'none';
            hiddenText.style.display = 'none'; // hidden 텍스트 숨기기
            document.querySelector('.spring-text').style.display = 'block'; // spring-text 텍스트 표시
            document.body.style.background = dayBgColor; // 배경을 아침 하늘 색으로 변경
            sun.style.opacity = 1; // 태양 이미지 나타나기
            backgroundVideo.style.display = 'none'; // 유튜브 영상 숨기기
            
            // Snowman 이미지 추가
            document.body.appendChild(snowman); // 스노우맨을 body에 추가
            snowman.style.position = 'absolute'; // 절대 위치로 설정
            snowman.style.bottom = '31%'; // 화면 하단에서 10% 위치로 설정
            snowman.style.left = '50%'; // 화면 중앙에 위치하도록 설정
            snowman.style.transform = 'translateX(-50%)'; // 정확히 중앙 정렬
            snowman.style.transition = 'opacity 1s ease-out'; // 스노우맨이 나타날 때 서서히 나타나도록 설정
            snowman.style.opacity = 1; // 초기 opacity 설정 (1로 설정하여 보이게 함)
        }
    }
});

document.addEventListener('mouseup', function () {
    isMouseDown = false;
});



let isSnowmanDragging = false;

// 눈사람을 자유롭게 이동할 수 있도록 설정
snowman.style.position = 'absolute'; // 절대 위치로 설정
snowman.style.transition = 'top 0.1s, left 0.1s'; // 부드러운 이동 효과

snowman.addEventListener('mousedown', function (e) {
    isSnowmanDragging = true;
    offsetX = e.clientX - snowman.offsetLeft;
    offsetY = e.clientY - snowman.offsetTop;
    snowman.style.opacity = 0.8; // 드래그 시작 시 불투명도 변경
});

document.addEventListener('mousemove', function (e) {
    if (isSnowmanDragging) {
        let leftPosition = e.clientX - offsetX;
        let topPosition = e.clientY - offsetY;

        // 눈사람을 화면 내에서만 움직이게 제한
        if (leftPosition < 0) leftPosition = 0;
        if (leftPosition > window.innerWidth - snowman.offsetWidth) {
            leftPosition = window.innerWidth - snowman.offsetWidth;
        }

        if (topPosition < 0) topPosition = 0;
        if (topPosition > window.innerHeight - snowman.offsetHeight) {
            topPosition = window.innerHeight - snowman.offsetHeight;
        }

        snowman.style.left = leftPosition + 'px';
        snowman.style.top = topPosition + 'px';

        // 태양 아래로 드래그 시 눈사람 위치 고정 및 제거
        if (leftPosition > (sun.offsetLeft - snowman.offsetWidth / 2) && leftPosition < (sun.offsetLeft + sun.offsetWidth - snowman.offsetWidth / 2)) {
            if (topPosition > (sun.offsetTop - snowman.offsetHeight / 2) && topPosition < (sun.offsetTop + sun.offsetHeight - snowman.offsetHeight / 2)) {
                snowman.style.left = sun.offsetLeft - snowman.offsetWidth / 2 + 'px';
                snowman.style.top = sun.offsetTop + sun.offsetHeight + 10 + 'px'; // 태양 밑에 고정
                
                // 배경 색상 변경
                document.body.style.background = finalBgColorAfterSnowman;

                // 눈사람 서서히 사라지기
                snowman.style.transition = 'opacity 2s ease-out';
                snowman.style.opacity = 0; // 서서히 사라짐

                // 눈사람 사라진 후 Grass 이미지 나타나기
                setTimeout(() => {
                    snowman.remove(); // 눈사람 제거
                
                    grass.classList.add('grass'); // Grass 이미지에 CSS 클래스 추가
                    document.body.appendChild(grass); // Grass 이미지 추가
                    setTimeout(() => {
                        grass.style.opacity = 1; // 나타나기
                    }, 10); // DOM에 추가 후 opacity 트랜지션 실행
                }, 2000);
                
            }
        }
    }
});

document.addEventListener('mouseup', function () {
    isSnowmanDragging = false; // 눈사람 드래그 종료
    snowman.style.opacity = 1; // 드래그 종료 시 불투명도 복원
});

snowman.addEventListener('mousedown', function (e) {
    e.preventDefault(); // 기본 드래그 동작 방지
    isSnowmanDragging = true;
    offsetX = e.clientX - snowman.offsetLeft;
    offsetY = e.clientY - snowman.offsetTop;
    snowman.style.opacity = 0.8; // 드래그 시작 시 투명도 변경
});

let sunClickCount = 0; // 해 클릭 횟수

// Flowers 이미지 생성 및 추가
let flowers = document.createElement('img');
flowers.src = 'images/flowers.png'; // Flowers 이미지 경로
flowers.classList.add('flowers'); // flowers 클래스 추가
document.body.appendChild(flowers); // Flowers 이미지를 body에 추가

// 해 클릭 이벤트
sun.addEventListener('click', function () {
    if (sunClickCount < 15) {
        sunClickCount++; // 클릭 횟수 증가
        let opacity = sunClickCount / 15; // 클릭할 때마다 투명도 증가
        flowers.style.opacity = opacity; // Flowers 이미지 투명도 설정
    } else if (sunClickCount === 15) {
        sunClickCount++; // 16번째 클릭 처리
        // 모든 요소 숨기기
        document.querySelector('.sun').style.display = 'none';
        document.querySelector('.moon').style.display = 'none';
        document.querySelector('.building').style.display = 'none';
        flowers.style.display = 'none';
        grass.style.display = 'none';

        // 텍스트 숨기기
        document.querySelectorAll('.container p, .container h1').forEach(element => {
            element.style.display = 'none';
        });

        // 배경을 검은색으로 변경
        document.body.style.backgroundColor = 'black';

        const girl = document.createElement('img');
        girl.src = 'images/girl.png'; // girl 이미지 경로
        girl.classList.add('girl'); // "girl" 클래스 추가
        girl.style.opacity = 0; // 처음에는 보이지 않게 설정
        girl.style.transition = 'opacity 5s ease-in'; // 5초에 걸쳐 서서히 나타남
        document.body.appendChild(girl); // 이미지 추가
        
        setTimeout(() => {
            girl.style.opacity = 1; // 서서히 나타나기
        }, 100);

        setTimeout(() => {
            const star = document.createElement('img');
            star.src = 'images/star.png'; // star 이미지 경로
            star.classList.add('star'); // "star" 클래스 추가
            document.body.appendChild(star); // 이미지 추가
            
            // 별 클릭 시 배경색 변경 및 요소 숨기기
        star.addEventListener('click', function() {
             // 배경색 변경
             document.body.style.backgroundColor = '#22b2ff'; 

        // 새 텍스트 요소 가져오기
        const newText = document.querySelector('.new-text');

    // 별과 여자를 숨기기
        star.style.display = 'none'; // 별 사라짐
             const girl = document.querySelector('.girl'); // 여자 요소 선택
             if (girl) {
        girl.style.display = 'none'; // 여자 사라짐
    }
    
        // 새 텍스트 나타나기
        if (newText) {
            newText.style.display = 'block'; // 텍스트 표시
            newText.style.opacity = 1; // 서서히 나타나는 효과 추가 가능
    }
});
});



    // 소녀 등장 효과 (소녀 이미지가 있다고 가정)
    setTimeout(() => {
        document.querySelector('.girl').style.opacity = 1; // 소녀가 나타나도록
    }, 1000); // 1초 후에 소녀가 보이도록 설정
}});


// 두 색상 사이를 비율에 맞춤
function interpolateColors(color1, color2, ratio) {
    let c1 = hexToRgb(color1);
    let c2 = hexToRgb(color2);

    let r = Math.round(c1.r + (c2.r - c1.r) * ratio);
    let g = Math.round(c1.g + (c2.g - c1.g) * ratio);
    let b = Math.round(c1.b + (c2.b - c1.b) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    return { r, g, b };
}

