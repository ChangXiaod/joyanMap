/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.jy.www;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jy.dao.ServletDataDao;
import com.jy.utils.CONSTANTS;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author root
 */
@WebServlet(name = "PostBatchServlet", urlPatterns = {"/post_batch_data"})

public class PostBatchServlet extends HttpServlet {

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

        PrintWriter out = null;
        JSONObject res_obj = null;
        String line = null;
        StringBuffer jb = new StringBuffer();
        ServletDataDao sdd = new ServletDataDao();
        try {
            //输出流
            out = response.getWriter();
            //执行结果对象
            res_obj = new JSONObject();
            //读取输入流到StringBuffer中
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null) {
                jb.append(line);
            }

            //使用JSONObject的parseObject方法解析JSON字符串
            JSONObject jsonObject = JSONObject.parseObject(jb.toString());
            //获取前端参数
            String sid = jsonObject.getString("sid");
            System.out.println("[debug]sid:" + sid);
            String data = jsonObject.getString("data");
            System.out.println("[debug]data:" + data);
            //将从前端获得数据转为json数组
            JSONArray data_array = JSON.parseArray(data);
            if (data_array != null && data_array.size() > 0) {
                //将数据保存到数据库表中
                int num = sdd.addBatchData(sid, data_array);
                if (num > 0) {
                    //增加数据成功
                    res_obj.put("code", CONSTANTS.SUCCESS);
                    res_obj.put("info", CONSTANTS.INFO_ADD_SUCCESS);
                } else {
                    res_obj.put("code", CONSTANTS.ERROR_ADD_DATA);
                    res_obj.put("info", CONSTANTS.INFO_ADD_FAIL);
                }
            } else {
                //转换为json失败
                res_obj.put("code", CONSTANTS.ERROR_INPUT_PARAMETER);
                res_obj.put("info", CONSTANTS.INFO_INPUT_PARAMETER);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("数据异常，请联系管理员！");
            //服务器发生异常情况
            res_obj.put("code", CONSTANTS.ERROR_SERVER);
            res_obj.put("info", CONSTANTS.INFO_SERVER_FAIL);
            res_obj.put("stacktrace", e.getMessage());
        } finally {
            if (out != null) {
                //将执行结果发送到前端
                System.out.println(res_obj.toString());
                out.write(res_obj.toString());
                //关闭输出流
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
