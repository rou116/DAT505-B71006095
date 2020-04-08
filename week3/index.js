//  隐藏左上角的视图控制
BIMWINNER.BOS3D.GlobalData.EnableViewController = false;

//  配置三维主对象参数
const option = {
	host: "https://webapi.bos.xyz",
	viewport: "viewport"
};

// 初始化主对象
const viewer3D = new BIMWINNER.BOS3D.Viewer(option);
const tool = new BIMWINNER.BOS3D.ToolBar(viewer3D);

// 模型主视角
const mainView = {
	position: {x: -8923.967839940955, y: 2409.7625005869895, z: 5303.804519227368},   //相机位置
	target: {x: -788.3752274988785, y: -1360.0954690502097, z: -135.6878000301781},   //相机焦点
	up: {x: 0, y: 0, z: 1}  //相机正方向
}

// 正式环境
const modelKey = "47755136";

const devcode = "e10e59bf0ee97213ca7104977877bd1a";

// 将模型添加进场景
viewer3D.addView(modelKey, devcode);
// 根据窗口大小更新画布
viewer3D.resize(window.innerWidth, window.innerHeight);

// 要更改材质的构件id
const componentId = ["47755136_3uXpDSeP5A_gRI8FyJJnUO"];

// 初始化，主函数
const init = () => {
	//  加载完成后恢复按钮功能
	viewer3D.getViewerImpl().modelManager.addEventListener(BIMWINNER.BOS3D.EVENTS.ON_LOAD_COMPLETE, () => {
		addRestorButton();
		// 定义一个主场景视角，以获得一个最佳的视点位置
		viewer3D.flyTo(mainView);
		changeMaterial();  // 改变构件的材质类型
		addButtons();
	});
}


// 改变材质种类，此处提供了"MeshBasicMaterial","MeshStandardMaterial",
// "MeshLambertMaterial","MeshPhongMaterial"四种材质的使用，更多材质的学习
// 请去threejs官网查看
const changeMaterial = (matreial) => {
	$("#buttonDiv").find("button").addClass("layui-btn-primary");
	const cpntCorlorArray = [0.5, 0.5, 0.5];  // 定义构件的颜色数组
	const cpColor = new THREE.Color(cpntCorlorArray[0], cpntCorlorArray[1], cpntCorlorArray[2]); // 创建三维里的颜色
	const component = viewer3D.getViewerImpl().modelManager.getComponent(componentId)[0].mesh; // 拿到场景中的构件，以便于对它进行材质的修改

	switch (matreial) {
		// 将此构件的材质改成MeshBasicMaterial，
		// THREE中材质的一种，这种材质不受光照影响
		case "基础材质":
			component.material = new THREE.MeshBasicMaterial({
				color: cpColor,
			});
			$("#基础材质").removeClass("layui-btn-primary");
			break;

		// 基于物理的标准材料,在实践中，这提供了比MeshLambertMaterial或
		// MeshPhongMaterial更准确和逼真的结果，代价是计算成本更高。
		case "标准材质":
			component.material = new THREE.MeshStandardMaterial({
				color: cpColor,
				metalness: 0.6  //  这种材料多少像金属一样。 非金属材料，如木材或石材，使用0.0，金属使用1.0。
			                    // 默认值为0.5。 0.0到1.0之间的值可用于生锈的金属外观。
			});
			$("#标准材质").removeClass("layui-btn-primary");
			break;

		// 将此构件的材质改成MeshStandardMaterial，
		// THREE中材质的一种，将specular属性设置成和材质color一样的颜色有类似金属的效果
		// 将specular属性设置成灰色会有类似塑料的效果
		case "锋材质":
			component.material = new THREE.MeshPhongMaterial({
				color: cpColor,
				specular: cpColor,
			});
			$("#锋材质").removeClass("layui-btn-primary");
			break;

		// 将此构件的材质改成MeshLambertMaterial，
		// THREE中材质的一种，这种材质适用于暗淡、不光亮表面。
		// 这个材质是本三维引擎默认使用的材质
		case "兰伯特材质":
			component.material = new THREE.MeshLambertMaterial({
				color: cpColor
			});
			$("#兰伯特材质").removeClass("layui-btn-primary");
		default:

	}

	viewer3D.render();
}

// 添加左侧的按钮操控区
const addButtons = () => {
	const materials = ["基础材质", "标准材质", "兰伯特材质", "锋材质"];
	materials.forEach(item => {
		const $buttons = $(`<button style="width: 200px" id=${item} class='layui-btn layui-btn-primary'>${item}</button>`);
		$("#buttonDiv").append($buttons);
		$("#" + item).click(() => changeMaterial(item));
	})
}

// 创建复位按钮,目的是点击按钮的时候将模型回复到初始状态
const addRestorButton = () => {
	const XHZ = new BIMWINNER.BOS3D.XHZ(viewer3D);
	XHZ.addRestorButton(function () {
		viewer3D.flyTo(mainView);
	});
	// 调整样式
	const toolId = viewer3D.viewerImpl.uuid;
	$("#home" + toolId).css("padding", "1px 7px 2px");
}

// 监听浏览器窗口变化，自动适应画布为浏览器窗口大小
window.addEventListener("resize", function () {
	viewer3D.resize(window.innerWidth, window.innerHeight);
});

// 运行主函数
init();
