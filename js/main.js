
(window.onresize = function () {
    var win_height = $(window).height();
    var win_width = $(window).width();
    if (win_width <= 768) {
        $(".tailoring-content").css({
            "top": (win_height - $(".tailoring-content")
                .outerHeight()) / 2,
            "left": 0
        });
    } else {
        $(".tailoring-content").css({
            "top": (win_height - $(".tailoring-content")
                .outerHeight()) / 2,
            "left": (win_width - $(".tailoring-content")
                .outerWidth()) / 2
        });
    }
})();

var width = height = 0;
var files = ''
var source = ''
var canvas = document.getElementById('drawCanvas');
var context = canvas.getContext('2d');
function draw() { 
    if($('.disabled').length > 1) {
        return false
    }
    $('#iosSave').hide();
    $('#drawCanvas').show()
    var size = Number($('#numbers').val()) || 14
    var num = 0;
    var code = $('#words').val()
    if(code.length == 0) {
        code = '    ';
    }
    context.drawImage(document.getElementById('drawImgs'), 0, 0);  // 在canvas上画出图片
    for (var i = size; i < height; i += size) {
        for (var j = 0; j < width; j += size) {
            let x = j + size / 2
            let y = i
            if (x > width) x = x - size
            if (y > height) y = y - size
            let c = context.getImageData(x, y, 1, 1).data
            context.beginPath();
            let color = shadeColor(RgbToHex(c[0], c[1], c[2]), 1);
            context.fillStyle = color
            context.font = size + 'px Arial';
            context.fillText(code[num % (code.length)], j, i)
            num++;
        }
    }
    files = canvas.toDataURL('image/png');
    $('#downloadMenu').removeClass('disabled');
}
// 选择文件触发事件  
function selectImg(file) {
    //文件为空，返回  
    if (!file.files || !file.files[0]) {
        return;
    }
    $(".tailoring-container").toggle();
    var reader = new FileReader();
    reader.onload = function (evt) {
        var replaceSrc = evt.target.result;
        // 更换cropper的图片  
        $('#tailoringImg').cropper('replace', replaceSrc, false); // 默认false，适应高度，不失真  
    }
    reader.readAsDataURL(file.files[0]);
}
// cropper图片裁剪  
$('#tailoringImg').cropper({
    aspectRatio: 1 / 1, // 默认比例  
    preview: '.previewImg', // 预览视图  
    guides: false, // 裁剪框的虚线(九宫格)  
    autoCropArea: 0.5, // 0-1之间的数值，定义自动剪裁区域的大小，默认0.8  
    movable: false, // 是否允许移动图片  
    dragCrop: true, // 是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域  
    movable: true, // 是否允许移动剪裁框  
    resizable: true, // 是否允许改变裁剪框的大小  
    zoomable: false, // 是否允许缩放图片大小  
    mouseWheelZoom: false, // 是否允许通过鼠标滚轮来缩放图片  
    touchDragZoom: true, // 是否允许通过触摸移动来缩放图片  
    rotatable: true, // 是否允许旋转图片  
    crop: function (e) {
        // 输出结果数据裁剪图像。  
    }
});
// 旋转  
$(".cropper-rotate-btn").on("click", function () {
    $('#tailoringImg').cropper("rotate", 45);
});
// 复位  
$(".cropper-reset-btn").on("click", function () {
    $('#tailoringImg').cropper("reset");
});
// 换向  
var flagX = true;
$(".cropper-scaleX-btn").on("click", function () {
    if (flagX) {
        $('#tailoringImg').cropper("scaleX", -1);
        flagX = false;
    } else {
        $('#tailoringImg').cropper("scaleX", 1);
        flagX = true;
    }
    flagX != flagX;
});

// 确定按钮点击事件  
$("#sureCut").on("click", function () {
    if ($("#tailoringImg").attr("src") == null) {
        return false;
    } else {
        var cas = $('#tailoringImg').cropper('getCroppedCanvas'); // 获取被裁剪后的canvas  
        var base64 = cas.toDataURL('image/jpeg'); // 转换为base64  
        $("#drawImgs").prop("src", base64); // 显示图片  
        $("#drawImgs").on('load', function () { 
            width = $("#drawImgs").width();
            height = $("#drawImgs").height();
            canvas.setAttribute("width", width);
            canvas.setAttribute('height', height);
            context.drawImage(document.getElementById('drawImgs'), 0, 0);  // 在canvas上画出图片
            $('#drawMenu').removeClass('disabled');
            closeTailor(); // 关闭裁剪框  
        })

    }
});

// 关闭裁剪框  
function closeTailor() {
    $(".tailoring-container").toggle();
}

//GRB颜色转Hex颜色
function RgbToHex(a, b, c) {
    var r = /^\d{1,3}$/;
    if (!r.test(a) || !r.test(b) || !r.test(c)) return console.error(a, b, c);
    var hexs = [a.toString(16), b.toString(16), c.toString(16)];
    for (var i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = "0" + hexs[i];
    return "#" + hexs.join("");
}
// 颜色加深
function shadeColor(color, percent) {
    var num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}
//  模拟点击a 标签进行下载
function download() {
    if($('.disabled').length > 0) {
        return false
    }
    $('#iosSave').show().prop('src',files);
    $('#drawCanvas').hide()    
    $('.popup').show()
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = files;
    link.setAttribute('download', new Date().toLocaleString());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}