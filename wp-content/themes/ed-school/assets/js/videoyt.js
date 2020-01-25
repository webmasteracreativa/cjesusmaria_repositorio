function clickon(){
    let urlyt = $('.modal-yt').attr('href');
    $('.modal-body iframe').attr('src',`${urlyt}?autoplay=1&loop=1&rel=0&wmode=transparent`); 
}
$(document).ready(function () {
    $('button.close,.modal').click(function(){
        $('.modal').removeClass('show');
        $('.modal-body iframe').attr('src','');
    });

    $('.modal-yt').click(function(){
        clickon();
    });

    //api youtube
    var key = 'AIzaSyCy2VWvmzx6a9kj4XMlZZMjSZ0p2rDRl0A';
    var playconpaz = 'PLZkUV01oONwqgFauDnhlYSl_O3p19VWu9';
    var playnoti = 'PLZkUV01oONwor1T3uBWizUar-zQEANBsm';
    var URL = 'https://www.googleapis.com/youtube/v3/playlistItems';
    var videoList = [];
    var videoList1 = [];

    var optionpaz = {
        part: 'snippet',
        key: key,
        maxResults: 50,
        playlistId: playconpaz
    }
    var optionnoti = {
        part: 'snippet',
        key: key,
        maxResults: 50,
        playlistId: playnoti
    }


    function loadVidspaz() {
        $.getJSON(URL, optionpaz, function (data) {
            resultsLooppaz(data);
        });
    }
    function loadVidsnoti() {
        $.getJSON(URL, optionnoti, function (data) {
            resultsLoopnoti(data);
        });
    }

    loadVidsnoti();
    loadVidspaz();

    function resultsLooppaz(data) {
        $.each(data.items, function (i, item) {
            let thumb = item.snippet.thumbnails.medium.url;
            let title = item.snippet.title;
            let fechaVideo= item.snippet.publishedAt;
            let date = fechaVideo.split("T");
            let vid = item.snippet.resourceId.videoId;
            let getVideos = "https://www.googleapis.com/youtube/v3/videos?part=statistics&id="+ vid +"&key="+ key;
            $.getJSON(getVideos, function(data2){
                let viewCount = data2.items[0].statistics.viewCount;
                let likeCount = data2.items[0].statistics.likeCount;
                let commentCount = data2.items[0].statistics.commentCount;
                videoList.push({
                    link: thumb,
                    titulo: title,
                    fecha: fechaVideo,
                    fechaitem: date[0],
                    video: vid,
                    vistas: viewCount,
                    likes: likeCount,
                    comentarios: commentCount
                });
                videoList.sort((a, b) => (a.fecha < b.fecha) ? 1 : -1);
            });
        });
    }
    function resultsLoopnoti(data) {
        $.each(data.items, function (i, item) {
            let thumb = item.snippet.thumbnails.medium.url;
            let title = item.snippet.title;
            let fechaVideo= item.snippet.publishedAt;
            let date = fechaVideo.split("T");
            let vid = item.snippet.resourceId.videoId;
            let getVideos = "https://www.googleapis.com/youtube/v3/videos?part=statistics&id="+ vid +"&key="+ key;
            $.getJSON(getVideos, function(data2){
                let viewCount = data2.items[0].statistics.viewCount;
                let likeCount = data2.items[0].statistics.likeCount;
                let commentCount = data2.items[0].statistics.commentCount;
                videoList1.push({
                    link: thumb,
                    titulo: title,
                    fecha: fechaVideo,
                    fechaitem: date[0],
                    video: vid,
                    vistas: viewCount,
                    likes: likeCount,
                    comentarios: commentCount
                });                
                videoList1.sort((a, b) => (a.fecha < b.fecha) ? 1 : -1);
            });
        });
    }
    setTimeout(function(){
        render(videoList.length);
        render1(videoList1.length);
    },2000);
    function render1(num){
        for(let i = 0; i < num; i++){
            $('#notimagazine .swiper-wrapper').append(`
                <div class="swiper-slide">
                <div class="d-flex flex-column align-items-start w-100 item-yt">
                <a href="https://www.youtube.com/embed/${videoList1[i].video}" class="modal-yt" onclick="clickon()" data-toggle="modal" data-target="#exampleModal"><img src="${videoList1[i].link}" alt="" class="w-100"></a>
                <h4>
                <a href="https://www.youtube.com/embed/${videoList1[i].video}" class="modal-yt" onclick="clickon()" data-toggle="modal" data-target="#exampleModal">${videoList1[i].titulo}</a>
                </h4>
                <p>${videoList1[i].fechaitem}</p>
                <p>
                <span>${videoList1[i].vistas}views</span>
                <span> ${videoList1[i].likes}likes</span>
                <span> ${videoList1[i].comentarios}comments</span>
                </p>
                </div>
                </div>
                `);
        }
    }
    function render(num){
        for(let i = 0; i < num; i++){
            $('#teleconpaz .swiper-wrapper').append(`
                <div class="swiper-slide">
                <div class="d-flex flex-column align-items-start w-100 item-yt">
                <a href="https://www.youtube.com/embed/${videoList[i].video}" class="modal-yt" onclick="clickon()" data-toggle="modal" data-modal="#exampleModal"><img src="${videoList[i].link}" alt="" class="w-100"></a>
                <h4>
                <a href="https://www.youtube.com/embed/${videoList[i].video}" class="modal-yt" onclick="clickon()" data-toggle="modal" data-target="#exampleModal">${videoList[i].titulo}</a>
                </h4>
                <p>${videoList[i].fechaitem}</p>
                <p>
                <span>${videoList[i].vistas}views</span>
                <span> ${videoList[i].likes}likes</span>
                <span> ${videoList[i].comentarios}comments</span>
                </p>
                </div>
                </div>
                `);
        }
    }
    setTimeout(function(){
        //swiper
        var mySwiper = new Swiper('.swiper-container', {
          slidesPerView: 4,
          slidesPerColumn: 1,
          spaceBetween: 10,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
              return '<span class="' + className + '">' + (index + 1) + '</span>';
              },
            }   
        });
        $('.nav-link').click(function(e){
            e.preventDefault();
            var paneTarget = $(this).attr('href');
            var $thePane = $('.tab-pane' + paneTarget);
            var paneIndex = $thePane.index();

            $('.nav-link').removeClass('active');
            $(this).addClass('active');
            $('.tab-pane').removeClass('active');
            $(paneTarget).addClass('active');

            if ($thePane.find('.swiper-container').length > 0 && 0 === $thePane.find('.swiper-slide-active').length) {
                mySwiper[paneIndex].update();
            }
        })   
        $('.modal-yt').click(function(e){
            e.preventDefault();
            $('.modal').addClass('show');
        });

    }, 2000);
});