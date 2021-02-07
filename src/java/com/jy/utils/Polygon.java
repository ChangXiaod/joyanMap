package com.jy.utils;

import java.util.ArrayList;
import java.util.List;

/*
 * 实现接口的多边形类
 * */
public class Polygon implements IPolygon {

    private List<Point> list;//用list 存点的坐标（要有顺序）

    public Polygon() {
        list = new ArrayList<Point>();
    }

    /*
 * 添加一个list
 **/
    @Override
    public IPolygon AddVertexs(List<Point> vertexs) {
        // TODO Auto-generated method stub
        list = vertexs;
        return null;
    }

    /*
 * 添加一个点，给定位置（顺序）
 * @see IPolygon#AddVertex(int, Point)
     */
    @Override
    public IPolygon AddVertex(int Index, Point vertex) {
        // TODO Auto-generated method stub
        list.add(Index, vertex);
        return null;
    }

    /*
 * list末尾添加一个点
 * @see IPolygon#AddVertex(Point)
     */
    @Override
    public IPolygon AddVertex(Point vertex) {
        // TODO Auto-generated method stub
        AddVertex(list.size(), vertex);
        return null;
    }

    /*
 * 判断。以判断的点作为端点，水平方向的y轴交点作为线段另一端点，与多边形相交
 * 交点个数为奇数，在多边形内，交点个数为偶数，在多边形外（越界）
 * @see IPolygon#IsInside(Point)
     */
    @Override
    public Boolean IsInside(Point targetPoint) {
        // TODO Auto-generated method stub
        int m = list.size();
        if (m < 3) {
            System.out.println("点小于3个，不构成范围！");
            return false;
        }
        int n = 0;
        int sum = 0;
        Point a = list.get(n);
        Point b = list.get(n);
        for (n = 0; n < m; n++) {
            a = list.get(n);
            if (n == m - 1) {
                b = list.get(0);
            } else {
                b = list.get(n + 1);
            }

            if (JudgeHelper.intersect(a, b, targetPoint)) {
                sum++;
            } else {
            }
        }
        if (sum % 2 == 0) {
           // System.out.println("在范围之外！！！");
            return false;
        } else {
          //  System.out.println("在范围之内！！！");
            return true;
        }
    }
}
