// 打开弹窗函数
// 参数：标题，价格，图片路径，描述
function openModal(title, price, imageSrc, desc) {
    // 1. 获取弹窗元素
    var modal = document.getElementById("productModal");
    
    // 2. 把数据填进去
    document.getElementById("m-title").innerText = title;
    document.getElementById("m-price").innerText = price;
    document.getElementById("m-img").src = imageSrc;
    document.getElementById("m-desc").innerText = desc;

    // 3. 显示弹窗（设置为 Flex 布局以居中）
    modal.style.display = "flex";
}

// 关闭弹窗函数
function closeModal() {
    var modal = document.getElementById("productModal");
    modal.style.display = "none";
}

// 点击弹窗外部黑色区域也可以关闭
window.onclick = function(event) {
    var modal = document.getElementById("productModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}