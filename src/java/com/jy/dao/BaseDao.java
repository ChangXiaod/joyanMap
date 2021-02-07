/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.jy.dao;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jy.utils.CONSTANTS;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Administrator
 */
public class BaseDao {

    private String driver = null;
    private String url = null;
    private String username = null;
    private String password = null;
    private String ds_type = null;
    java.text.DecimalFormat df = new java.text.DecimalFormat("#.##");
    SimpleDateFormat myFmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private Connection conn = null;
    private boolean single_transaction = true;
    private static final String LAST_INSERT_ID = "SELECT LAST_INSERT_ID() as id";

    /*
    *@函数名称：loadLoacal
    *@函数功能：加载本地数据库配置
     */
    private void loadLoacal() {
        InputStream in = null;
        try {
            // 加载配置文件
            in = BaseDao.class.getClassLoader()
                    .getResourceAsStream("config/DB.properties");
            Properties properties = new Properties();
            properties.load(in);
            setDriver(properties.getProperty("driver"));
            setUrl(properties.getProperty("url"));
            setUsername(properties.getProperty("username"));
            setPassword(properties.getProperty("password"));
            // 加载驱动
            Class.forName(getDriver());
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            try {
                //关闭数据流
                if (in != null) {
                    in.close();
                }
            } catch (IOException ex) {
                Logger.getLogger(BaseDao.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    /*
    *@函数名称：BaseDao
    *@函数功能：构造函数，是否通过本地配置文件加载数据库配置
    *@入参：布尔型
     */
    public BaseDao(boolean local) {
        if (local == true) {
            loadLoacal();
        }
    }

    /*
    * 函数名称：testConnection
    * 函数功能：测试当前数据库配置是否正确
     */
    public boolean testConnection() {
        boolean result = false;
        try {
            //链接到数据库
            Connection conn = getConnection();
            if (conn != null) {
                result = true;
            }
            //释放数据库连接
            conn.close();
        } catch (SQLException ex) {
            Logger.getLogger(BaseDao.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            return result;
        }
    }

    /*
    * 开启transaction，避免每次执行sql的时候重新连接
    * 
     */
    public void openTransaction() {
        single_transaction = false;
    }

    /*
    * 关闭transaction,进入单条执行模式
     */
    public void closeTransaction() {
        single_transaction = true;
        this.close();
    }

    /**
     *
     * 获取数据库连接
     *
     * @throws SQLException
     */
    public Connection getConnection() {
        try {
//            if (conn == null) {
//                System.out.println("[debug]db url:" + getUrl() + ";username:" + getUsername());
                conn = DriverManager.getConnection(getUrl(), getUsername(), getPassword());
                return conn;
//            } else {
//                return conn;
//            }

        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }

    public void close() {
        if (conn != null) {
            try {
                conn.close();
                conn = null;
            } catch (SQLException ex) {
                Logger.getLogger(BaseDao.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    /**
     * 释放资源
     *
     * @param connection
     * @param preparedStatement
     * @param resultSet
     */
    public void releaseDB(ResultSet resultSet,
            PreparedStatement preparedStatement, Connection connection) {
        //关闭结果集
        if (resultSet != null) {
            try {
                resultSet.close();
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        //
        if (preparedStatement != null) {
            try {
                preparedStatement.close();
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        //关闭连接
        if (connection != null) {
            try {
                connection.close();
                conn = null;
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }

    }

    /**
     * 查询模版，返回json字符串
     *
     * @param sql 查询语句
     * @param args 参数
     * @return json字符串
     */
    public String query(String sql, Object... args) {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
//            conn = JdbcUtils.getConnection();
            conn = getConnection();
            ps = conn.prepareStatement(sql);
            for (int i = 0; i < args.length; i++) {
                ps.setObject(i + 1, args[i]);
            }
            rs = ps.executeQuery();
            //返回json字符串
            return this.resultSetToJson(rs);
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        } finally {
            //释放、关闭资源
            if (single_transaction) {
                releaseDB(rs, ps, conn);
            } else {
//                 System.out.println("relaese me");
                releaseDB(rs, ps, null);
            }
        }
    }

    /**
     * 查询模版，返回json对象
     *
     * @param sql 查询语句
     * @param args 参数
     * @return json字符串
     */
    public JSONArray queryArray(String sql, Object... args) {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            ps = conn.prepareStatement(sql);
            for (int i = 0; i < args.length; i++) {
                ps.setObject(i + 1, args[i]);
            }
            rs = ps.executeQuery();
            //返回json字符串
            return result2JsonArray(rs);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new DaoException(e.getMessage(), e);
        } finally {
            //释放、关闭资源
            if (conn != null) {
                try {
                    ps.close();
                    conn.close();
                    conn = null;
                } catch (SQLException ex) {
                    Logger.getLogger(BaseDao.class.getName()).log(Level.SEVERE, null, ex);
                }

            }
//            if (single_transaction) {
//                releaseDB(rs, ps, conn);
//            } else {
////                 System.out.println("relaese me");
//                releaseDB(rs, ps, null);
//            }
        }
    }

    /**
     * 查询模版，返回json对象
     *
     * @param sql 查询语句
     * @param args 参数
     * @return json字符串
     */
    public JSONArray longQueryArray(String sql, Object... args) {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            ps = conn.prepareStatement(sql);
            for (int i = 0; i < args.length; i++) {
                ps.setObject(i + 1, args[i]);
            }

            rs = ps.executeQuery();
            //返回json字符串
            return result2JsonArray(rs);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new DaoException(e.getMessage(), e);
        } finally {
//            releaseDB(rs, ps, conn);
            releaseDB(rs, ps, null);
            //释放、关闭资源
        }
    }

    /**
     * 查询模版，返回json对象
     *
     * @param sql 查询语句
     * @param args 参数
     * @return json字符串
     */
    public JSONObject queryObject(String sql, Object... args) {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            ps = conn.prepareStatement(sql);
            for (int i = 0; i < args.length; i++) {
                ps.setObject(i + 1, args[i]);
            }
            rs = ps.executeQuery();
            //返回json字符串
            return result2JsonObject(rs);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new DaoException(e.getMessage(), e);
        } finally {
            //释放、关闭资源
            if (single_transaction) {
                releaseDB(rs, ps, conn);
            } else {
//                 System.out.println("relaese me");
                releaseDB(rs, ps, null);
            }
        }
    }

    /**
     * 获取单条记录，例如：统计、count、max、min等
     *
     * @param sql
     * @param args
     * @return
     */
    public Map getForMap(String sql, Object... args) {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            ps = conn.prepareStatement(sql);
            for (int i = 0; i < args.length; i++) {
                ps.setObject(i + 1, args[i]);
            }
            rs = ps.executeQuery();
            //返回json字符串
            return this.resultSetToMap(rs);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new DaoException(e.getMessage(), e);
        } finally {
            //释放、关闭资源
            if (single_transaction) {
                releaseDB(rs, ps, conn);
            } else {
//                 System.out.println("relaese me");
                releaseDB(rs, ps, null);
            }
        }
    }

    /**
     * 添加、修改、删除抽象类
     *
     * @param sql
     * @param args 参数
     * @return
     */
    public int direct_update(String sql) throws SQLException {
        Connection conn = null;
        Statement st = null;
        try {
            conn = getConnection();
            st = conn.createStatement();
            return st.executeUpdate(sql);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new DaoException(e.getMessage(), e);
        } finally {
            //释放、关闭资源
            if (st != null) {
                st.close();
            }
            if (conn != null) {
                conn.close();
            }
        }
    }

    public int update(String sql, Object... args) {
        Connection conn = null;
        PreparedStatement ps = null;
        try {
            conn = getConnection();
            ps = conn.prepareStatement(sql);
            for (int i = 0; i < args.length; i++) {
                ps.setObject(i + 1, args[i]);
            }
            //执行修改操作
            return ps.executeUpdate();
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        } finally {
            if (conn != null) {
                try {
                    ps.close();
                    conn.close();
                    conn = null;
                } catch (SQLException ex) {
                    Logger.getLogger(BaseDao.class.getName()).log(Level.SEVERE, null, ex);
                }

            }
            //释放、关闭资源
//            if (single_transaction) {
//                releaseDB(null, ps, conn);
//            } else {
//                 System.out.println("relaese me");
//                releaseDB(null, ps, null);
//            }
        }
    }

    public int insert(String sql, Object... args) {
        Connection conn = null;
        PreparedStatement ps = null;
        try {
            conn = getConnection();
            ps = conn.prepareStatement(sql);
            for (int i = 0; i < args.length; i++) {
                ps.setObject(i + 1, args[i]);
            }
            //执行修改操作
            int num = ps.executeUpdate();
            if (num > 0) {
                ps = conn.prepareStatement(LAST_INSERT_ID);
                ResultSet res = ps.executeQuery();
                if (res.next()) {
                    return res.getInt("id");
                } else {
                    return num;
                }
            } else {
                return 0;
            }
            //ps.getGeneratedKeys().getObject(1);
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        } finally {
            //释放、关闭资源
            if (single_transaction) {
                releaseDB(null, ps, conn);
            } else {
//                 System.out.println("relaese me");
                releaseDB(null, ps, null);
            }
        }
    }

    /**
     * 将resultSet转化为JSON
     *
     * @param rs
     * @return JSONArray字符串
     */
    private String resultSetToJson(ResultSet rs) {
        // json数组 
        JSONArray array = result2JsonArray(rs);
        if (array != null) {
            return array.toString();
        } else {
            return null;
        }

    }

    /**
     * 将resultSet转化为JSON对象
     *
     * @param rs
     * @return JSONArray字符串
     */
    private JSONArray result2JsonArray(ResultSet rs) {
        // json数组  
        JSONArray array = new JSONArray();
        // 获取列数  
        ResultSetMetaData metaData;
        try {
            metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();
            // 遍历ResultSet中的每条数据  
            while (rs.next()) {
                JSONObject jsonObj = new JSONObject();
                // 遍历每一列  
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = metaData.getColumnLabel(i);
//                    System.out.println("[coltype]" + metaData.getColumnTypeName(i));
                    //如果是小数，就只保留小数后两位
                    if ("double".equalsIgnoreCase(metaData.getColumnTypeName(i))
                            || "float".equalsIgnoreCase(metaData.getColumnTypeName(i))) {
                        double value = rs.getDouble(columnName);
                        jsonObj.put(columnName, df.format(value));
                    } else if ("TIMESTAMP".equalsIgnoreCase(metaData.getColumnTypeName(i))) {
                        //处理时间字符串后面多一个0的问题
                        Timestamp tp = rs.getTimestamp(columnName);
                        if (tp != null) {
                            String time = myFmt.format(rs.getTimestamp(columnName));
                            jsonObj.put(columnName, time);
                        } else {
                            jsonObj.put(columnName, "");
                        }
                    } else {
                        String value = rs.getString(columnName);
                        jsonObj.put(columnName, value);
                    }

                }
                array.add(jsonObj);
            }
            return array;
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }

    /**
     * 将resultSet转化为JSON对象
     *
     * @param rs
     * @return JSONArray字符串
     */
    private JSONObject result2JsonObject(ResultSet rs) {
        // json数组  
        JSONObject obj = new JSONObject();
        JSONArray array = new JSONArray();
        // 获取列数  
        ResultSetMetaData metaData;
        int columnCount = 0;
        try {
            metaData = rs.getMetaData();
            columnCount = metaData.getColumnCount();
            JSONArray columns = new JSONArray();
            for (int k = 1; k <= columnCount; k++) {
                //获取每列的名称
                String colname = metaData.getColumnName(k);
                columns.add(colname);
            }

            // 遍历ResultSet中的每条数据  
            while (rs.next()) {
                JSONObject jsonObj = new JSONObject();
                // 遍历每一列  
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = metaData.getColumnLabel(i);
                    if ("double".equalsIgnoreCase(metaData.getColumnTypeName(i))
                            || "float".equalsIgnoreCase(metaData.getColumnTypeName(i))) {
                        double value = rs.getDouble(columnName);
                        jsonObj.put(columnName, df.format(value));

                    } else {
                        String value = rs.getString(columnName);
                        jsonObj.put(columnName, value);
                    }
                }
                array.add(jsonObj);
            }
            //将数据和列的个数添加到对象中
            obj.put("columns", columns);
            obj.put("data", array);
            return obj;
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }

    /**
     * 将resultSet转化为Map
     *
     * @param rs
     * @return Map
     */
    private Map resultSetToMap(ResultSet rs) {
        Map<String, Object> map = new HashMap<>();
        try {
            // 获取列数
            ResultSetMetaData metaData;
            metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();
            // 判断结果集是否为空  
            if (rs.next()) {
                // 遍历每一列  
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = metaData.getColumnLabel(i);
                    String value = rs.getString(columnName);
                    map.put(columnName, value);
                }
            }
            return map;
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }

    /**
     * @return the driver
     */
    public String getDriver() {
        return driver;
    }

    /**
     * @param driver the driver to set
     */
    public void setDriver(String driver) {
        this.driver = driver;
    }

    /**
     * @return the url
     */
    public String getUrl() {
        return url;
    }

    /**
     * @param url the url to set
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return the ds_type
     */
    public String getDs_type() {
        return ds_type;
    }

    /**
     * @param ds_type the ds_type to set
     */
    public void setDs_type(String ds_type) {
        this.ds_type = ds_type;
    }
}
