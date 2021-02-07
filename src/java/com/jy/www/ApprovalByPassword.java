/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.jy.www;

import com.alibaba.fastjson.JSONObject;
import com.hn.utility.Md5Util;
import com.jy.dao.UserDao;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Administrator
 */
@WebServlet(name = "ApprovalByPassword", urlPatterns = {"/ApprovalByPassword"})
public class ApprovalByPassword  extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        //打开输出流
        PrintWriter out = response.getWriter();
        //构建返回对象
        JSONObject json = new JSONObject();
        try {
            //获取前端参数
            String loginName = request.getParameter("username");
            String pwd = request.getParameter("password");
            //比较会话中缓存的用户名和密码
            if (loginName != null && pwd != null) {
                UserDao ud = new UserDao();
                boolean res = ud.passwordApproval(loginName, Md5Util.md5(pwd));
                if (res == true) {
                    json.put("info", "恭喜您，账号密码验证成功！");
                    json.put("code", 0);
                } else {
                    json.put("info", "对不起，账号密码验证失败！");
                    json.put("code", 1);
                }
            } else {
                //密码错误
                json.put("info", "对不起，账号或者密码为空！");
                json.put("code", 2);
            }
        } catch (Exception e) {
            e.printStackTrace();
            json.put("info", "对不起，服务器发生内部错误：" + e.getMessage());
            json.put("code", 4);
        } finally {
            System.out.println(json.toString());
            out.write(json.toString());
            //关闭输出流
            if (out != null) {
                out.close();
            }
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
