var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var input = document.getElementById('words')
var img = document.getElementById('img');
var width = height = 0;
var code = ''
function getImage() {
    var file = document.getElementById('files').files[0];    
    var reader = new FileReader();
    if (file) {
        //通过文件流将文件转换成Base64字符串
        reader.readAsDataURL(file);
        //转换成功后
        reader.onloadend = function () {
            //将转换结果赋值给img标签
            img.src = reader.result;
            img.onload = function () {
                width = img.offsetWidth;
                height = img.offsetHeight;
                var num = 0
                canvas.setAttribute("width", width);
                canvas.setAttribute('height', height);
                ctx.drawImage(img, 0, 0);
            }
        }
    }
    else {
        img.src = "";
    }
}
function draw(size=14) {
    var num = 0
    code = input.value;
    ctx.drawImage(img, 0, 0);
    for (var i = size; i < height; i += size) {
        for (var j = 0; j < width; j += size) {
            let x = j + size/2 
            let y = i
            if(x > width) x = x - size
            if(y > height) y = y - size
            let c = ctx.getImageData(x, y, 1, 1).data
            ctx.beginPath();
            let color = shadeColor(RgbToHex(c[0], c[1], c[2]), 1);
            ctx.fillStyle = color
            ctx.font = size + 'px Arial';
            ctx.fillText(code[num % (code.length)], j, i)
            num++;
        }
    }
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