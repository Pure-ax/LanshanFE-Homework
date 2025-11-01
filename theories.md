#The lesson1 homework
1.外部样式表的引入：
    <link> 标签引入
        eg: <link type="text/css" rel="stylesheet" href="css/style.css" />
            type 表示被链接文档类型
            rel  表示当前文档与被链接文档之间的关系
            href 表示被链接文档的位置
    @import规则引入(在网络上搜索得知)
        eg: @import url("css/style.css");

2.在CSS的标准盒模型中，元素的总宽度 = width + padding + border + margin;

3.CSS的什么伪类用于选择鼠标悬停时的元素状态？
    :hover 表示悬停元素的状态;

4.CSS选择器的优先级按顺序从高到低为?
    对象范围从大到小，优先级从低到高，!important标记则优先级最高。

        !important > 行内样式(style = "...") > ID选择器(#id{}) > 类选择器(.class{}) 
        > 标签选择器(div{}) > 通用选择器(*{});

5.在CSS中，使用什么可以使某个样式规则具有更高的优先级，覆盖普通规则？(学长你的题号打错了...)

    !important