/**
 * 主页js
 * @module index
 * @namespace painter.controler
 */
(function($, global){
    "use strict";
    
    /**
     * 主页
     * @class Index
     * @static 
     */
    var Index = {
        /**
         * 初始化
         * @method init 
         */  
         init:function(){
             this.bindEvent();
         },
         
         /**
          * 绑定事件
          * @event bindEvent
          */
         bindEvent:function(){
            var $document = $(document),
                fileResult = null,
                imageResult = null;
             
            //绑定关闭浏览器前事件
            $(window).bind("beforeunload", function(e){
                return "图片尚未导出，您确定离开吗？";
            });

            //触发关闭浏览器事件
            $(window).unload(function(e){
                $("#nav-file-save").trigger('click');
            });

            //绑定撤销键盘事件ctrl+z
            $document.bind("keydown", function(e){
                if(e.ctrlKey && e.keyCode === 90){
                    $("#tool-wrap .tool button[data-tool-panel='Undo']").trigger('click');//触发撤销按钮事件
                    e.preventDefault();//阻止默认事件
                }
            });

            //绑定保存键盘事件ctrl+s
            $document.bind("keydown", function(e){
                if(e.ctrlKey && e.altKey && e.keyCode === 83){
                    $("#tool-wrap .tool button[data-tool-panel='Save']").trigger('click');//触发撤销按钮事件
                    e.preventDefault();//阻止默认事件
                }         
            });

            //绑定清除事件
            $document.bind("keydown", function(e){
                if(e.ctrlKey && e.keyCode === 68){
                    $("#tool-wrap .tool button[data-tool-panel='Garbage']").trigger('click');//触发撤销按钮事件
                    e.preventDefault();//阻止默认事件
                }         
            });
             
            //绑定导出事件
            $document.bind("keydown", function(e){
                if(e.ctrlKey && e.keyCode === 69){
                    $("#tool-wrap .tool button[data-tool-panel='Export']").trigger('click');//触发撤销按钮事件
                    e.preventDefault();//阻止默认事件
                }         
            });

            //绑定窗口大小改变事件
            $(window).bind("resize", function(e){
                var canvas = global.painter.canvas,
                    currentCanvas = canvas.currentCanvasContainer.getCanvas(),
                    bufferCanvas = canvas.bufferCanvasContainer.getCanvas(),
                    mouseCanvas = canvas.mouseCanvasContainer.getCanvas(),
                    negativeCanvas = global.painter.canvas.negativeCanvasContainer.getCanvas();

                //更新各个画布
                currentCanvas.updateSize();
                bufferCanvas.updateSize();
                mouseCanvas.updateSize();
                negativeCanvas.updateSize();
            });
             
            //=================================================
            //绑定导入图片模态框事件
             
            //文件输入框改变事件
            $document.delegate("#image-modal-file", "change", function(e){
                var files = this.files,
                    reader = new FileReader();
                 
                reader.readAsDataURL(files[0]);
                 
                reader.onload = function(){
                    var $imageModal = $("#image-modal"),
                        $view = $("#image-modal-view", $imageModal);
                    imageResult = reader.result;
                    $view.attr("src", reader.result);
                     
                    $view.bind("load", function(){
                        var $imageModal = $("#image-modal"),
                            $width = $("#image-modal-width", $imageModal),
                            $height = $("#image-modal-height", $imageModal);
                        $width.val($(this).width());
                        $height.val($(this).height());
                    });                     
                };                
            });
             
            //确定事件
            $document.delegate("#image-modal-ok", "click", function(e){
                var currentCanvas = global.painter.canvas.currentCanvasContainer.getCanvas(),
                    image = new global.painter.model.shapeModel.ImageShape(),
                    $imageModal = $("#image-modal"),
                    x = $("#image-modal-x", $imageModal).val(),
                    y = $("#image-modal-y", $imageModal).val(),
                    width = $("#image-modal-width", $imageModal).val(),
                    height = $("#image-modal-height", $imageModal).val();                 
                 
                image.init({
                    x:x,
                    y:y,
                    width:width,
                    height:height,
                    src: imageResult
                });
                 
                currentCanvas.paint(image);
            });

            //=================================================
            //绑定导出图片模态框事件
            $document.delegate("#nav-file-export", "click", function(e){
                var currentCanvasDom = global.painter.canvas.currentCanvasContainer.getCanvas().getCanvas(),
                    $imgView = $("#save-image").get(0);                                 
                $imgView.src = currentCanvasDom.toDataURL("image/png").replace("image/png", "image/octet-stream");
            });
            
            $document.delegate("#image-modal-export", "click", function() {
                var $image = $("#save-image");
                var pic = window.open($image.attr("src"));
                pic.document.execCommand("saveAs", false, $image.attr("src"));
            });
         }
    };
    
    $(document).ready(function(){
        Index.init();
    });
}(jQuery, window));
