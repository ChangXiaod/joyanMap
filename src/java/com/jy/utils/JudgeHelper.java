package com.jy.utils;

/*
 * 实现判断的方法
 */
public class JudgeHelper {

    static double mult(Point a, Point b, Point c) {
        return (a.getX() - c.getX()) * (b.getY() - c.getY()) - (b.getX() - c.getX()) * (a.getY() - c.getY());
    }//叉积 判断是否越界
    //相交返回true, 不相交返回false

    static boolean intersect(Point A, Point B, Point location) {
        Point left = new Point(0, location.getY());//最左端设置为（0，y）

        if (Math.max(A.getX(), B.getX()) < Math.min(location.getX(), left.getX())) {
            return false;
        }
        if (Math.max(A.getY(), B.getY()) < Math.min(location.getY(), left.getY())) {
            return false;
        }
        if (Math.max(location.getX(), left.getX()) < Math.min(A.getX(), B.getX())) {
            return false;
        }
        if (Math.max(location.getY(), left.getY()) < Math.min(A.getY(), B.getY())) {
            return false;
        }
        if (mult(location, B, A) * mult(B, left, A) < 0) {
            return false;
        }
        if (mult(A, left, location) * mult(left, B, location) < 0) {
            return false;
        }
        return true;
    }
}
