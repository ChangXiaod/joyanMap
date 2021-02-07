package com.jy.utils;
import java.util.List;

/*
 * 这是接口
 * 
 */
public interface IPolygon {

    IPolygon AddVertexs(List<Point> vertexs);

    IPolygon AddVertex(int Index, Point vertex);

    IPolygon AddVertex(Point vertex);

    Boolean IsInside(Point targetPoint);
    //主函数需要调取的接口
}
