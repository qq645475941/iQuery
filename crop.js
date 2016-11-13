/**
 * Created by qingyun on 16/9/7.
 */


//上传图片
var dialogBox=dom.getByDId('dialogBox');
var imgs=dom.getByDId('imgs');
var fileuploadBtn = dom.getByDId('uploadingFile');

console.log("ddfsdf"+fileuploadBtn);
fileuploadBtn.onchange = function(e){
    dialogBox.style.display='block';
    var file = fileuploadBtn.files[0];
    var reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onloadend = function(e){
        imgs.setAttribute('src', e.target.result);
        crop()
    }
};
function crop() {
    var slider = dom.getByDId('slider');
    var sliderBar = dom.getByDId('sliderBar');
    slider.addEventListener('mousedown', function (e) {
        function fn(e) {
            var x = e.offsetX;
            if (e.target == sliderBar) {
                if (e.movementX > 0) {
                    x = e.offsetX + sliderBar.offsetLeft;
                }
                if (e.movementX < 0) {
                    x = e.offset;
                }

            }
            //判断sliderBar.style.left是否为空,是的话给个默认值0
            if (e.movementX > 0 && x <= 270 && x >= 0) {
                sliderBar.style.left = x + 'px';
            }
            //往左边移动
            if (e.movementX < 0 && x > 0 && x <= 270) {
                sliderBar.style.left = x + 'px';
            }
            var ratio = 1 + parseFloat(sliderBar.style.left) / 270;
            imgs.style.width = 300 * ratio + 'px';
            sliderBar.setAttribute('data-value', ratio);

//                console.log([e.offsetX,e.target,sliderBar.offsetLeft])
        }

        slider.addEventListener('mousemove', fn);
        slider.addEventListener('mouseleave', function () {
            slider.removeEventListener('mousemove', fn);

        });
        slider.addEventListener('mouseup', function () {
            slider.removeEventListener('mousemove', fn);
        })
    });
    //图片拖拽
    var preview = dom.getByDId('preview');


    var avatarCfg = {
        width: 300
    };
    var imgsrc = imgs.getAttribute('src');
    var img = new Image();
    img.src = imgsrc;

    img.onload = function () {
        console.log([img.width, img.height]);
//                console.log("dddd" + imgs.src);
        avatarCfg.baseWidth = img.width;
        avatarCfg.baseRatio = img.width / avatarCfg.width
    };

    preview.addEventListener('mousedown', function (e) {
        function fn(e) {
            imgs.style.left = imgs.offsetLeft + e.movementX + 'px';
            imgs.style.top = imgs.offsetTop + e.movementY + 'px';
//                console.log([imgs.offsetLeft,e.movementX,sliderBar.offsetLeft])
        }

        preview.addEventListener('mousemove', fn);
        preview.addEventListener('mouseleave', function () {
            preview.removeEventListener('mousemove', fn);
        });
        preview.addEventListener('mouseup', function () {
            preview.removeEventListener('mousemove', fn);
        });
    });


    var okBtn = dom.getByDId('okbt');
    var noBtn=dom.getByDId('nobt');
    var previewCropImg = dom.getByDId('previewCropImg');
    okBtn.addEventListener('click', function () {
        drawCanvas();
        dialogBox.style.display='none';
    });
    noBtn.addEventListener('click', function () {
        dialogBox.style.display='none';
    });
    //图片放大
    function drawCanvas() {
        var cvs = document.createElement('canvas');
        cvs.width = 150;
        cvs.height = 150;
        var ctx = cvs.getContext('2d');
        var ratio = (sliderBar.getAttribute('data-value') || 1);
        console.log(ratio);
        ratio = avatarCfg.baseRatio / ratio;
        var top = parseFloat(imgs.style.top || 0);
        var left = parseFloat(imgs.style.left || 0);

        var x = 75 - left;
        var y = 75 - top;

        var imgX = x * ratio,
            imgY = y * ratio,
            imgW = 150 * ratio,
            imgH = 150 * ratio;
//                console.log('dsdsds' + img);
        ctx.drawImage(img, imgX, imgY, imgW, imgH, 0, 0, 150, 150);
        var dataUrl = cvs.toDataURL();
        previewCropImg.src = dataUrl;
    }
}
