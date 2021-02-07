/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.jy.dao;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jy.dao.BaseDao;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

/**
 *
 * @author Administrator
 */
public class ServletDataDao extends BaseDao {
    private static final String QUERY_TB_SQL = "SELECT TB_NAME, SQL_STR FROM tb_sid_map WHERE SID = ?";
    private static final String ADD_DATA_PREFIX = "INSERT INTO ";
    private static final String REPLACE_DATA_PREFIX = "REPLACE INTO ";
    private static final String UPDATE_DATA_PREFIX = "UPDATE ";
    private static final String DELETE_DATA_PREFIX = "DELETE FROM ";
    private static final String SELECT_DATA_PREFIX = "SELECT * FROM ";
    private static final String COUNT_DATA_PREFIX = "SELECT COUNT(1) AS TOTAL FROM ";

    public ServletDataDao() {
        super(true);
    }

    /*
     *函数名称：addData
     *函数功能：向数据表添加数据
     *输入参数：String sid, JSONObject data_obj
     *输出参数：int
     */
    public int addLog(int user_id, String user_name, String real_name, String operation, String log, String sid, boolean isUpdate) {
        //插入前先判断是否存在tb_log_today表
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
//        String currentDay = sdf.format(new Date());
//        //判断是否存在对应的日表，不存在则建立表
//        String createSql = "create table if not exists tb_log_" + currentDay +
//             "( `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录编号', " +
//            " `user_id` int(10) unsigned DEFAULT NULL COMMENT '用户编号', "+
//            " `user_name` varchar(100) DEFAULT NULL COMMENT '用户名'," +
//            "  `real_name` varchar(100) DEFAULT NULL COMMENT '真实姓名'," +
//            "  `operation` varchar(100) DEFAULT NULL COMMENT '操作：增删改'," +
//            "  `sid` varchar(40) DEFAULT NULL COMMENT 'web服务编号'," +
//            "  `updateStatus` int(10) unsigned NOT NULL COMMENT '是否更新操作', " +
//            "  `log` text COMMENT '执行的sql语句'," +
//            "  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '执行时间'," +
//            "  PRIMARY KEY (`id`)" +
//            ") ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8";
//        
//        int num = super.insert(createSql);
        int updateStatus;
        if (isUpdate == true) {
            updateStatus = 1;
            String insert_sql = "insert into tb_log " + "(user_id, user_name, real_name, operation, log, sid, updateStatus, time) values (?, ?, ?, ?, ?, ?, ?, now())";
            return super.insert(insert_sql, user_id, user_name, real_name, operation, log, sid, updateStatus);

        } else {
            updateStatus = 0;
            String insert_sql = "insert into tb_log " + "(user_id, user_name, real_name, operation, sid, updateStatus, time) values (?, ?, ?, ?, ?, ?, now())";
            return super.insert(insert_sql, user_id, user_name, real_name, operation, sid, updateStatus);

        }
//        String insert_sql = "insert into tb_log_"+ currentDay + "(user_id, user_name, real_name, operation, log, sid, updateStatus, time) values (?, ?, ?, ?, ?, ?, ?, now())";

    }

    /*
     *函数名称：addData
     *函数功能：向数据表添加数据
     *输入参数：String sid, JSONObject data_obj
     *输出参数：int
     */
    public int addData(String sid, JSONObject data_obj) {
        String tb_name = queryTbName(sid);
        String sql = ADD_DATA_PREFIX + tb_name + " ";
        String field_str = "(";
        String values_str = "values (";
        //根据数据参数动态生成sql语句
        Set keys = data_obj.keySet();
        Iterator itr = keys.iterator();
        //迭代所有的关键字，生成field和value字符串
        while (itr.hasNext()) {
            String field = (String) itr.next();
            if (field != null && checkField(tb_name, field)) {
                //处理所有的单引号和双引号
                String mdata = data_obj.getString(field);
                if (mdata != null && !mdata.equals("")) {
                    //添加field列表
                    field_str += field + ",";
                    //添加value列表
                    mdata = mdata.replace("'", "\\'");
                    values_str += "'" + mdata + "',";
                }
            }
        }
        //去除字符串最后一个逗号
        field_str = field_str.substring(0, field_str.length() - 1);
        field_str += ") ";
        values_str = values_str.substring(0, values_str.length() - 1);
        values_str += ")";
        //拼接最终的sql语句
        sql += field_str + values_str;
        System.out.println("[debug]" + sql);
        //执行最终sql语句
        int num = super.insert(sql);
        return num;
    }

    /*
     *函数名称：replaceData
     *函数功能：向数据表更新数据
     *输入参数：String sid, JSONObject data_obj
     *输出参数：int
     */
    public int replaceData(String sid, JSONObject data_obj) {
        String tb_name = queryTbName(sid);
        String sql = REPLACE_DATA_PREFIX + tb_name + " ";
        String field_str = "(";
        String values_str = "values (";
        //根据数据参数动态生成sql语句
        Set keys = data_obj.keySet();
        Iterator itr = keys.iterator();
        //迭代所有的关键字，生成field和value字符串
        while (itr.hasNext()) {
            String field = (String) itr.next();
            if (field != null && checkField(tb_name, field)) {
                field_str += field + ",";
                values_str += "'" + data_obj.getString(field) + "',";
            }
        }
        //去除字符串最后一个逗号
        field_str = field_str.substring(0, field_str.length() - 1);
        field_str += ") ";
        values_str = values_str.substring(0, values_str.length() - 1);
        values_str += ")";
        //拼接最终的sql语句
        sql += field_str + values_str;
        System.out.println("[debug]" + sql);
        //执行最终sql语句
        int num = super.update(sql);
        return num;
    }

    /*
     *函数名称：addBatchData
     *函数功能：向数据表批量添加数据
     *输入参数：String sid, JSONArray data_set
     *输出参数：int
     */
    public int addBatchData(String sid, JSONArray data_set) {
        String tb_name = queryTbName(sid);
        String sql = REPLACE_DATA_PREFIX + tb_name + " ";
        String field_str = "(";
        String values_str = "values ";
        if (data_set != null && data_set.size() > 0) {
            Iterator itr = null;
            for (int i = 0; i < data_set.size(); i++) {
                JSONObject data_obj = data_set.getJSONObject(i);
                //根据数据参数动态生成sql语句
                //为了使批量插入的数据与列名顺序一致，以第一行数据为准
                Set keys = data_set.getJSONObject(0).keySet();
                itr = keys.iterator();
                //迭代所有的关键字，生成field和value字符串
                values_str += "(";
                while (itr.hasNext()) {
                    String field = (String) itr.next();
                    if (field != null && checkField(tb_name, field)) {
                        if (i == 0) {
                            field_str += field + ",";
                        }
                        values_str += "'" + data_obj.getString(field) + "',";
                    }
                }
                //去除字符串最后一个逗号
                if (i == 0) {
                    field_str = field_str.substring(0, field_str.length() - 1);
                    field_str += ") ";
                }
                values_str = values_str.substring(0, values_str.length() - 1);
                if (i < data_set.size() - 1) {
                    values_str += "),";
                } else {
                    values_str += ")";
                }

            }
        }

        //拼接最终的sql语句
        sql += field_str + values_str;
        System.out.println("[debug]batch:" + sql);
        //执行最终sql语句
        int num = super.update(sql);
        return num;
    }

    /*
     *函数名称：updateBatchData
     *函数功能：向数据库表批量更新数据，如果数据库表中存在相同条件的数据，
     *则执行update操作，如果不存在符合条件的记录，则执行insert操作
     *输入参数：String sid：服务编号, JSONObject data_set：需要更新的数据,JSONArray exclude_columns:不更新字段
     *输出参数：int：更新记录条数
     *作者：douzf
     *时间：2020-08-21
     */
    public int updateBatchData(String sid, JSONArray data_set, JSONArray exclude_columns) {
        int total = 0;
        //输入参数检查
        if (sid == null || data_set == null || data_set.size() == 0) {
            return -1;
        }
        String key_sql = "SELECT COLUMN_NAME  FROM information_schema.`COLUMNS` "
                + "WHERE column_key = 'PRI' AND table_schema = 'db_coal' AND TABLE_NAME = ?";
        String tb_name = queryTbName(sid);
        //先查询数据表的主键字段
        JSONArray keys = queryArray(key_sql, tb_name);
        //如果查询结果不为空并且结果集记录数大于0，表示该表设置了主键,
        //如果该表没有设置主键，直接执行insert操作
        if (keys == null || keys.size() == 0) {
            int num = addBatchData(sid, data_set);
            return num;
        }
        //逐行判断输入的数据集，如果已经有相同主键的数据，则执行更新操作，
        //如果没有，则执行插入操作
        for (int i = 0; i < data_set.size(); i++) {
            String where = "";
            String query_sql = "select *  from " + tb_name;
            //提取一行数据
            JSONObject line = data_set.getJSONObject(i);
            //逐行读取数据，生成查询及更新条件
            for (int j = 0; j < keys.size(); j++) {
                JSONObject column = keys.getJSONObject(j);
                String column_name = column.getString("COLUMN_NAME");
                where += column_name + "='" + line.getString(column_name) + "' AND ";
            }
            //删除where后面的多于的AND
            if (where.length() > 0) {
                where = where.substring(0, where.length() - 4);
                System.out.println("[debug where]" + where);
                query_sql = query_sql + " where " + where;
                System.out.println("[debug query_sql]" + query_sql);
            }
            //查询表中是否存在主键相同的数据记录
            JSONArray res = queryArray(query_sql);
            if (res != null && res.size() > 0) {
                //执行update操作
                int num = updateData(sid, line, where, exclude_columns);
                total += num;
            } else {
                //执行insert操作
                int num = addData(sid, line);
                total += num;
            }
        }
        //返回修改记录总数
        return total;
    }

    /*
     *函数名称：update_or_add
     *函数功能：向数据库表更新数据，如果数据库表中存在相同条件的数据，
     *则执行update操作，如果不存在符合条件的记录，则执行insert操作
     *输入参数：String sid：服务编号, JSONObject data_set：需要更新的数据,JSONArray exclude_columns:不更新字段
     *输出参数：int：更新记录条数
     *作者：douzf
     *时间：2020-08-21
     */
    public int update_or_add(String sid, JSONObject data_obj, JSONArray exclude_columns) {
        int total = 0;
        //输入参数检查
        if (sid == null || data_obj == null) {
            return -1;
        }
        String key_sql = "SELECT COLUMN_NAME  FROM information_schema.`COLUMNS` "
                + "WHERE column_key = 'PRI' AND table_schema = 'db_coal' AND TABLE_NAME = ?";
        String tb_name = queryTbName(sid);
        //先查询数据表的主键字段
        JSONArray keys = queryArray(key_sql, tb_name);
        //如果查询结果不为空并且结果集记录数大于0，表示该表设置了主键,
        //如果该表没有设置主键，直接执行insert操作
        if (keys == null || keys.size() == 0) {
            int num = addData(sid, data_obj);
            return num;
        }
        //逐行判断输入的数据集，如果已经有相同主键的数据，则执行更新操作，
        //如果没有，则执行插入操作
        String where = "";
        String query_sql = "select *  from " + tb_name;
        //逐行读取数据，生成查询及更新条件
        for (int j = 0; j < keys.size(); j++) {
            JSONObject column = keys.getJSONObject(j);
            String column_name = column.getString("COLUMN_NAME");
            where += column_name + "='" + data_obj.getString(column_name) + "' AND ";
        }
        //删除where后面的多于的AND
        if (where.length() > 0) {
            where = where.substring(0, where.length() - 4);
            System.out.println("[debug where]" + where);
            query_sql = query_sql + " where " + where;
            System.out.println("[debug query_sql]" + query_sql);
        }
        //查询表中是否存在主键相同的数据记录
        JSONArray res = queryArray(query_sql);
        if (res != null && res.size() > 0) {
            //执行update操作
            int num = updateData(sid, data_obj, where, exclude_columns);
            total += num;
        } else {
            //执行insert操作
            int num = addData(sid, data_obj);
            total += num;
        }
        //返回修改记录总数
        return total;
    }

    /*
     *函数名称：addTrainTicketData
     *函数功能：向数据表批量添加铁路大票数据
     *输入参数：int qibie, String kuangfa_time,JSONArray data_set
     *输出参数：int
     */
    public int addTrainTicketData(String qibie, String kuangfa_time, ArrayList data_set) {
        System.out.println("[kuangfa_time]" + kuangfa_time);
        int num = 0;
        //导入铁路大票数据
        String sql = "replace into tb_dapiao ("
                + "qibie,"
                + "kuangfa_time,"
                + "shunwei,"
                + "gudao,"
                + "chehao,"
                + "chezhong,"
                + "zizhong,"
                + "huanchang,"
                + "fazhan,"
                + "daoda,"
                + "pinming,"
                + "zaizhong,"
                + "checi,"
                + "daoda_time,"
                + "other"
                + ")"
                + "values ";
        String values_str = "";
        //添加自重数据
        String sql_zizhong = "replace into tb_pizhong_standard(box_no, pizhong) values ";
        String zizhong_str = "";
        if (data_set != null && data_set.size() > 0) {
            for (int i = 0; i < data_set.size(); i++) {
                String[] data_obj = (String[]) data_set.get(i);
                zizhong_str += "('" + data_obj[2] + "','" + data_obj[4] + "'),";
                for (int j = 0; j < data_obj.length; j++) {
                    if (j == 0) {
                        values_str += "('" + qibie + "','" + kuangfa_time + "','" + data_obj[j] + "',";
                    } else if (j < data_obj.length - 1) {
                        values_str += "'" + data_obj[j] + "',";
                    } else {
                        values_str += "'" + data_obj[j] + "'),";
                    }
                }
            }
            //删除最后一个逗号
            values_str = values_str.substring(0, values_str.length() - 1);
            zizhong_str = zizhong_str.substring(0, zizhong_str.length() - 1);
            //拼接最终的sql语句
            sql += values_str;
            sql_zizhong += zizhong_str;
//            System.out.println("[debug]batch:" + sql);
            //执行最终sql语句
            num = super.update(sql);
            num = super.update(sql_zizhong);

        }
        return num;
    }

    /*
     *函数名称：replaceBatchData
     *函数功能：向数据表批量更新数据
     *输入参数：String sid, JSONArray data_set
     *输出参数：int
     */
    public int replaceBatchData(String sid, JSONArray data_set) {
        String tb_name = queryTbName(sid);
        String sql = REPLACE_DATA_PREFIX + tb_name + " ";
        String field_str = "(";
        String values_str = "values ";
        if (data_set != null && data_set.size() > 0) {
            Iterator itr = null;
            for (int i = 0; i < data_set.size(); i++) {
                JSONObject data_obj = data_set.getJSONObject(i);
                //根据数据参数动态生成sql语句
                //为了使批量插入的数据与列名顺序一致，以第一行数据为准
                Set keys = data_set.getJSONObject(0).keySet();
                itr = keys.iterator();
                //迭代所有的关键字，生成field和value字符串
                values_str += "(";
                while (itr.hasNext()) {
                    String field = (String) itr.next();
                    if (field != null && checkField(tb_name, field)) {
                        if (i == 0) {
                            field_str += field + ",";
                        }
                        values_str += "'" + data_obj.getString(field) + "',";
                    } else {
                        continue;
                    }
                }
                //去除字符串最后一个逗号
                if (i == 0) {
                    field_str = field_str.substring(0, field_str.length() - 1);
                    field_str += ") ";
                }
                values_str = values_str.substring(0, values_str.length() - 1);
                if (i < data_set.size() - 1) {
                    values_str += "),";
                } else {
                    values_str += ")";
                }

            }
        }

        //拼接最终的sql语句
        sql += field_str + values_str;
        System.out.println("[debug]batch:" + sql);
        //执行最终sql语句
        int num = super.update(sql);
        return num;
    }

    /*
     *函数名称：checkField
     *函数功能：判断指定字段是否在表中存在
     *输入参数：String tab_name, String field
     *输出参数：boolean:true表示该字段存在，false表示不存在
     */
    private boolean checkField(String tab_name, String field) {
        String sql = "SELECT COLUMN_NAME FROM information_schema.columns WHERE  table_schema=database() AND table_name = ? AND column_name = ?";
        JSONArray array = super.queryArray(sql, tab_name, field);
        //判断是否存在指定的列
        return array != null && array.size() > 0;
    }

    /*
     *函数名称：setDefaultMap
     *函数功能：将指定编号的地图设置为默认地图
     *输入参数：String id：地图编号
              String persiod：期别
              String map_type：地图类型
     *输出参数：int：大于1表示设置成功，否则表示设置失败
     */
    public int setDefaultMap(String id, String period, String map_type) {
        String sql = "update tb_map set isdefault = case id  when ? then 1  else 0 end where period = ? and type = ?";
        System.out.println("[dql]" + sql + "  id=" + id + " period=" + period + " type=" + map_type);
        return update(sql, id, period, map_type);
    }

    /*
     *函数名称：updateData
     *函数功能：修改符合条件的数据
     *输入参数：String sid, JSONObject data_obj, JSONObject where_obj
     *输出参数：int
     */
    public int updateData(String sid, JSONObject data_obj, String where, JSONArray exclude_columns) {
        String tb_name = queryTbName(sid);
        String sql = UPDATE_DATA_PREFIX + tb_name + " SET ";
        //根据数据参数动态生成sql语句
        Set keys = data_obj.keySet();
        Iterator itr = keys.iterator();
        //迭代所有的关键字，生成field和value字符串
        while (itr.hasNext()) {
            String field = (String) itr.next();
            //判断该字段是否在数据库中存在  
            if (field != null && checkField(tb_name, field)) {
                //判断该字段是否为排除字段
                boolean ifexclude = false;
                if (exclude_columns != null && exclude_columns.size() > 0) {
                    //将当前字段与排除字段数组中的元素一一比较，如果有相同的，
                    //则放弃更新这个字段
                    for (int i = 0; i < exclude_columns.size(); i++) {
                        String exclude_column = exclude_columns.getString(i);
                        System.out.println(exclude_column + "-" + field);
                        if (field.equalsIgnoreCase(exclude_column)) {
                            ifexclude = true;
                            continue;
                        }
                    }
                }
                //经判断，该字段属于排除字段，就不执行下面的代码，进入下一个字段的处理
                if (ifexclude == true) {
                    continue;
                }

                //处理所有的单引号和双引号
                String mdata = data_obj.getString(field);
                if (mdata != null) {
                    mdata = mdata.replace("'", "\\'");
                }
                //设置更新字段的值
                sql += field + " = '" + mdata + "',";

            } else {
                continue;
            }
        }
        //去除字符串最后一个逗号
        sql = sql.substring(0, sql.length() - 1);
        //追加条件部分
        if (where != null && where.length() > 0) {
            sql += " where " + where;
        }
        //去除字符串最后一个对于的and
//        sql = sql.substring(0, sql.length() - 4);
        //拼接最终的sql语句
        System.out.println("[debug update sql]" + sql);
        //执行最终sql语句
        int num = super.update(sql);
        return num;
    }

    /*
     *函数名称：updateData
     *函数功能：修改符合条件的数据
     *输入参数：String sid, String... args
     *输出参数：int
     */
    public int updateData(String sid, String... variables) {
        String sql = querySQL(sid);
        if (sql == null) {
            return 0;
        }

        //拼接最终的sql语句
        return super.update(sql, variables);
    }

    /*
     *函数名称：deleteData
     *函数功能：删除符合条件的数据
     *输入参数：String sid, JSONObject where_obj
     *输出参数：int
     */
    public int deleteData(String sid, String where) {
        String tb_name = queryTbName(sid);
        String sql = DELETE_DATA_PREFIX + tb_name;
        //根据数据参数动态生成sql语句
        if (where != null && where.length() > 0) {
            sql += " where " + where;
        }
        //去除字符串最后一个对于的and
//        sql = sql.substring(0, sql.length() - 4);
        //拼接最终的sql语句
        System.out.println("[debug]" + sql);
        //执行最终sql语句
        int num = super.update(sql);
        return num;
    }

    /*
     *函数名称：queryData
     *函数功能：查询符合条件的数据
     *输入参数：String sid, String where, String orderby, int page, int rows
     *输出参数：String
     */
    public JSONObject queryData(String sid, String cols, String where, String groupby, String orderby, String desc, int page, int rows) {
        String tb_name = queryTbName(sid);
        if (tb_name == null) {
            return null;
        }
        String sql = SELECT_DATA_PREFIX + tb_name;
        //如果查询字段列表不为空，则进行替换
        if (cols != null && !cols.equalsIgnoreCase("")) {
            sql = sql.replace("*", cols);
        }
        String tsql = COUNT_DATA_PREFIX + tb_name;
        //根据数据参数动态生成sql语句
        if (where != null && where.length() > 0) {
            sql += " where " + where;
            tsql += " where " + where;
        }
        //根据聚合字段生成上sql语句
        if (groupby != null && groupby.length() > 0) {
            sql += " group by " + groupby;
            tsql += " group by " + groupby;
        }
        //根据排序参数生成sql语句
        if (orderby != null && orderby.length() > 0) {
            if ("true".equalsIgnoreCase(desc)) {
                sql += " order by " + orderby + " desc";
            } else {
                sql += " order by " + orderby + " asc";
            }

        }

        //添加分页限制
        sql += " LIMIT " + (page - 1) * rows + "," + rows;
        //拼接最终的sql语句
        System.out.println("[debug]" + sql + "\n" + tsql);
        //执行最终sql语句
        JSONArray data = super.queryArray(sql);
        //查询总记录数
        JSONArray total = super.queryArray(tsql);
        int all_num = 0;
        //如果没有groupby语句，总数就是查询出来的total字段
        if (groupby == null) {
            for (int i = 0; i < total.size(); i++) {
                all_num += total.getJSONObject(i).getIntValue("TOTAL");
            }
        } else {
            //如果含有groupby子句，总数就是返回的记录条数
            all_num = total.size();
        }

        //返回查询结果
        JSONObject res = new JSONObject();
        res.put("data", data);
        res.put("total", all_num);
//        System.out.println("[query result]" + res.toString());
        return res;
    }

    /*
     *函数名称：queryDataByKey
     *函数功能：查询符合条件的数据
     *输入参数：String sid, String... varables
     *输出参数：String
     */
    public JSONObject queryDataBySql(String sid, String... variables) {
        String sql = querySQL(sid);
        if (sql == null) {
            return null;
        }

        //拼接最终的sql语句
        JSONArray data = super.queryArray(sql, variables);
        //返回查询结果
        JSONObject res = new JSONObject();
        res.put("data", data);
        res.put("total", data.size());
        System.out.println("[query result]" + res.toString());
        return res;
    }

    /*
     *函数名称：queryDataByComplexSql
     *函数功能：查询符合条件的数据
     *输入参数：String sid, String where
     *输出参数：String
     */
    public JSONObject queryDataByComplexSql(String sid, String where) {
        String sql = querySQL(sid);
        if (sql == null) {
            return null;
        }

        //拼接最终的sql语句
        if (where != null) {
            sql = "select * from (" + sql + ") a where " + where;
            //去除可能会出现的分号，防止sql语句报错
            sql = sql.replaceAll(";", " ");
        }
        System.out.println("[complex sql]" + sql);
        JSONArray data = super.queryArray(sql);
        //返回查询结果
        JSONObject res = new JSONObject();
        res.put("data", data);
        res.put("total", data.size());
        System.out.println("[query result]" + res.toString());
        return res;
    }

    /*
     *函数名称：queryDataByKey
     *函数功能：查询符合条件的数据
     *输入参数：String sid, String cols, String key, String groupby, String orderby, String desc, int page, int rows
     *输出参数：String
     */
    public JSONObject queryDataByKey(String sid, String cols, String key, String groupby, String orderby, String desc, int page, int rows) {
        String tb_name = queryTbName(sid);
        if (tb_name == null) {
            return null;
        }
        String sql = SELECT_DATA_PREFIX + tb_name;
        //如果查询字段列表不为空，则进行替换
        if (cols != null && !cols.equalsIgnoreCase("")) {
            sql = sql.replace("*", cols);
        }
        String tsql = COUNT_DATA_PREFIX + tb_name;
        //根据数据参数动态生成sql语句
        ArrayList<String> field_list = queryColumns(tb_name);
        if (field_list != null && field_list.size() > 0) {
            String where = " where ";
            for (String field : field_list) {
                where += field + " like '%" + key + "%' or ";
            }
            //删除最后一个or
            where = where.substring(0, where.length() - 3);
            sql += where;
            tsql += where;
        }
        //根据聚合字段生成上sql语句
        if (groupby != null && groupby.length() > 0) {
            sql += " group by " + groupby;
            tsql += " group by " + groupby;
        }
        //根据排序参数生成sql语句
        if (orderby != null && orderby.length() > 0) {
            if ("true".equalsIgnoreCase(desc)) {
                sql += " order by " + orderby + " desc";
            } else {
                sql += " order by " + orderby + " asc";
            }

        }

        //添加分页限制
        sql += " LIMIT " + (page - 1) * rows + "," + rows;
        //拼接最终的sql语句
        System.out.println("[debug]" + sql + "\n" + tsql);
        //执行最终sql语句
        JSONArray data = super.queryArray(sql);
        //查询总记录数
        JSONArray total = super.queryArray(tsql);
        int all_num = 0;
        //如果没有groupby语句，总数就是查询出来的total字段
        if (groupby == null) {
            for (int i = 0; i < total.size(); i++) {
                all_num += total.getJSONObject(i).getIntValue("TOTAL");
            }
        } else {
            //如果含有groupby子句，总数就是返回的记录条数
            all_num = total.size();
        }

        //返回查询结果
        JSONObject res = new JSONObject();
        res.put("data", data);
        res.put("total", all_num);
        System.out.println("[query result]" + res.toString());
        return res;
    }

    /*
     *函数名称：queryData
     *函数功能：查询符合条件的数据
     *输入参数：String sid, String where, String orderby, int page, int rows
     *输出参数：String
     */
    public JSONObject queryDataFromDynaTable(String sid, String cols, String where, String groupby, String orderby, String desc, int page, int rows, String sampling) {
        String tb_name = sid;
        String sql = SELECT_DATA_PREFIX + tb_name;
        //如果查询字段列表不为空，则进行替换
        if (cols != null && !cols.equalsIgnoreCase("")) {
            sql = sql.replace("*", cols);
        }
        String tsql = COUNT_DATA_PREFIX + tb_name;
        //根据数据参数动态生成sql语句
        if (where != null && where.length() > 0) {
            sql += " where " + where;
            tsql += " where " + where;
        }
        //根据聚合字段生成上sql语句
        if (groupby != null && groupby.length() > 0) {
            sql += " group by " + groupby;
            tsql += " group by " + groupby;
        }
        //根据排序参数生成sql语句
        if (orderby != null && orderby.length() > 0) {
            if ("true".equalsIgnoreCase(desc)) {
                sql += " order by " + orderby + " desc";
            } else {
                sql += " order by " + orderby + " asc";
            }

        }

        //添加分页限制
        sql += " LIMIT " + (page - 1) * rows + "," + rows;
        //拼接最终的sql语句
        System.out.println("[debug]" + sql + "\n" + tsql);
        //执行最终sql语句
        JSONArray data = super.queryArray(sql);
        //查询总记录数
        JSONArray total = super.queryArray(tsql);
        int all_num = 0;
        //如果没有groupby语句，总数就是查询出来的total字段
        if (groupby == null) {
            for (int i = 0; i < total.size(); i++) {
                all_num += total.getJSONObject(i).getIntValue("TOTAL");
            }
        } else {
            //如果含有groupby子句，总数就是返回的记录条数
            all_num = total.size();
        }
        if (sampling != null) {
            //如果记录数大于300，则按抽样取数法返回300条左右的记录，确保前端性能
            int arraySize = data.size();
            if (arraySize > 300) {
                int shang = arraySize / 300;
                List list = new ArrayList();
                for (int i = 0; i < arraySize; i++) {
                    if (i % shang == 0) {
                        list.add(data.get(i));
                    }
                }
                data = new JSONArray(list);
            }
            all_num = data.size();
        }
        //返回查询结果
        JSONObject res = new JSONObject();
        res.put("data", data);
        res.put("total", all_num);
//        System.out.println("[query result]" + res.toString());
        return res;
    }

    /*
     *函数名称：queryColumns
     *函数功能：查找指定表的所有列
     *输入参数：String tb_name
     *输出参数：JSONArray
     */
    public JSONArray queryFields(String tb_name) {
        String sql = "show fields from ";
        //查询该服务对应的表格名称
        //生成查询语句
        sql += tb_name;
        //查询表的完整定义
        return super.queryArray(sql);
    }

    /*
     *函数名称：queryColumns
     *函数功能：查找指定表的所有列
     *输入参数：String tb_name
     *输出参数：ArrayList
     */
    public ArrayList queryColumns(String tb_name) {
        String sql = "show full fields from ";
        //查询该服务对应的表格名称
        //生成查询语句
        sql += tb_name;
        //查询表的完整定义
        JSONArray data = super.queryArray(sql);
        System.out.println("[commments]" + data.toJSONString());
        if (data != null && data.size() > 0) {
            //将查询结果存到数组中
            ArrayList columns = new ArrayList();
            for (int i = 0; i < data.size(); i++) {
                JSONObject obj = data.getJSONObject(i);
                //like字段只与varchar字段进行比较
                if (obj != null && obj.getString("Type").startsWith("varchar")) {
                    columns.add(obj.getString("Field"));
                }
            }
            //返回列名数组
            return columns;
        } else {
            return null;
        }
    }

    /*
     *函数名称：queryComment
     *函数功能：查找指定表的注释列
     *输入参数：String sid
     *输出参数：JSONObject
     */
    public HashMap queryComment(String sid) {
        String sql = "show full fields from ";
        //查询该服务对应的表格名称
        String tb_name = queryTbName(sid);
        if (tb_name == null) {
            return null;
        } else {
            //生成查询语句
            sql += tb_name;
        }
        //查询表的完整定义
        JSONArray data = super.queryArray(sql);
        System.out.println("[commments]" + data.toJSONString());
        if (data != null && data.size() > 0) {
            //将查询结果映射到哈希表中
            HashMap hm = new HashMap();
            for (int i = 0; i < data.size(); i++) {
                JSONObject obj = data.getJSONObject(i);
                if (obj != null) {
                    hm.put(obj.getString("Field"), obj.getString("Comment"));
                }
            }
            //返回映射表
            return hm;
        } else {
            return null;
        }
    }

    /*
     *函数名称：queryColsData
     *函数功能：查询符合条件的数据
     *输入参数：String sid, String[] cols, String where, String orderby, int page, int rows
     *输出参数：JSONObject
     */
    public JSONObject queryColsData(String sid, String cols, String where, String orderby, int page, int rows) {
        String tb_name = queryTbName(sid);
        if (tb_name == null) {
            return null;
        }
        String sql = SELECT_DATA_PREFIX + tb_name;
        String tsql = COUNT_DATA_PREFIX + tb_name;
        //添加输出字段
        if (cols != null && !"".equalsIgnoreCase(cols)) {
            sql = sql.replace("*", cols);
        }
        //根据数据参数动态生成sql语句
        if (where != null && where.length() > 0) {
            sql += " where " + where;
            tsql += " where " + where;
        }
        //根据排序参数生成sql语句
        if (orderby != null && orderby.length() > 0) {
            sql += " order by " + orderby + " desc";
        }

        //添加分页限制
        sql += " LIMIT " + (page - 1) * rows + "," + rows;
        //拼接最终的sql语句
        System.out.println("[debug]" + sql + "\n" + tsql);
        //执行最终sql语句
        JSONArray data = super.queryArray(sql);
        //查询总记录数
        JSONArray total = super.queryArray(tsql);

        //返回查询结果
        JSONObject res = new JSONObject();
        res.put("data", data);
        res.put("total", total.getJSONObject(0).getIntValue("TOTAL"));

        return res;
    }

    /*
     *函数功能：从数据库查询服务编号对应数据表名称
     *输入参数：String sid
     *输出参数：String
     */
    private String queryTbName(String sid) {
        String tb_name = null;
        //从数据库查询服务编号对应数据表名称
        JSONArray array = super.queryArray(QUERY_TB_SQL, sid);
        System.out.println("[QUERY_TB_SQL]" + QUERY_TB_SQL + " " + sid + ";obj = " + array.toJSONString());
        if (array != null && array.size() > 0) {
            tb_name = array.getJSONObject(0).getString("TB_NAME");
        }
        System.out.println("[tb_name]" + tb_name);
        return tb_name;
    }

    /*
     *函数功能：从数据库查询服务编号对应的sql语句
     *输入参数：String sid
     *输出参数：String
     */
    private String querySQL(String sid) {
        String sql = null;
        //从数据库查询服务编号对应数据表名称
        JSONArray array = super.queryArray(QUERY_TB_SQL, sid);
        System.out.println("[QUERY_TB_SQL]" + QUERY_TB_SQL + " " + sid + ";obj = " + array.toJSONString());
        if (array != null && array.size() > 0) {
            sql = array.getJSONObject(0).getString("SQL_STR");
        }
        System.out.println("[sql]" + sql);
        return sql;
    }

    /*
     *函数名称：queryOrgTree
     *函数功能：查询组织结构树
     *输入参数：String sid, JSONObject data_obj
     *输出参数：JSONArray
     */
    public JSONArray queryOrgTree(int id, int level) {
        String sql = "";
        //根据输入的编号组织sql语句
        if (id > 0 && level == 0) {
            //level== 0 查询集团公司下面的单位,单位总人数和在线人数
            //sql = "select id as real_id, " + id * 10000 + " + id as id, team_name as name, 'images/org.png' as icon from tb_teams where organ_id = " + id;
            // sql = "select tempTm.id as real_id, " + id * 10000 + " + tempTm.id as id, tempTm.team_name as name, 'images/org.png' as icon, IFNULL(tempWk.sum, 0) workerNum from (select * from tb_teams where organ_id = "+ id+ ") tempTm LEFT JOIN (select team_id, count(*) sum from tb_worker  group BY team_id) tempWk on tempTm.id = tempWk.team_id";
            sql = "select a.id as real_id, " + id * 10000 + " + a.id as id, a.team_name as name, 'images/org.png' as icon, a.workerNum, IFNULL(b.onLineNum,0) as onlineNum from (SELECT tempTm.id, tempTm.team_name,IFNULL(tempWk.sum, 0) workerNum FROM(SELECT * FROM tb_teams WHERE organ_id  = " + id + ") tempTm "
                    + "LEFT JOIN (SELECT team_id, count(*) sum FROM tb_worker GROUP BY team_id) tempWk ON tempTm.id = tempWk.team_id) a LEFT JOIN (SELECT team_id, worker_id, NAME, count(team_id) onlineNum FROM tb_rt_point where time > date_sub(now(),interval 5 MINUTE) GROUP BY team_id) b ON a.id = b.team_id";

            System.out.println(sql);
        } else if (level == 1) {
            //level == 1 查询单位下面的施工人员
            //sql = "select id as real_id, " + id * 10000 + " + id as id, real_name as name, 'images/username.png' as icon from tb_worker where team_id = " + id;
            sql = "select id as real_id, " + id * 10000 + " + id as id, real_name as name, team_id, 'images/username.png' as icon from tb_worker where team_id = " + id;
        } else {
            //查询集团公司
            sql = "select id as real_id, id, org_name as name,'images/org.png' as icon from tb_organization ";
        }
        //执行最终sql语句
        JSONArray array = super.queryArray(sql);
        System.out.println(sql + array.toString());
        return array;
    }

    /*
     *函数名称：queryRtPoint
     *函数功能：查询当前位置
     *输入参数：String sid, JSONObject data_obj
     *输出参数：JSONArray
     */
    public JSONArray queryRtPoint(int id, int level) {
        String sql = "";
        //根据输入的编号组织sql语句
        switch (level) {
            case 1:
                //查询施工队所有工人的位置信息
                //sql = "select device_uuid, name, latitude,longitude, alarms from tb_rt_point where team_id = ? and time > date_sub(now(),interval 5 MINUTE)";
                sql = "select device_uuid, device_type, team_id, worker_id, name, latitude, longitude, alarms from tb_rt_point where team_id = ? and time > date_sub(now(),interval 5 MINUTE)";
                break;
            case 2:
                //查询指定工人的位置信息
                sql = "select device_uuid, device_type, team_id, worker_id, name, latitude,longitude, alarms from tb_rt_point where worker_id = ? and time > date_sub(now(),interval 5 MINUTE)";
                break;
            default:
                return null;
            //查询所有聚合信息
//            sql = "select id as real_id, id, org_name as name,'images/org.png' as icon from tb_organization ";
        }
        //执行最终sql语句
        JSONArray array = super.queryArray(sql, id);
        System.out.println(sql + array.toString());
        return array;
    }

    /*
     *函数名称：queryHisPoint
     *函数功能：在日表里查询某个人的轨迹
     *输入参数：String cols, String where, String groupby, String orderby, String desc, int page, int rows, String startDate
     *输出参数：JSONObject
     */
    public JSONObject queryHisPoint(String cols, String where, String groupby, String orderby, String desc, int page, int rows, String startDate) {
        startDate = startDate.replace("-", "");
        String sql = SELECT_DATA_PREFIX + "tb_his_point_" + startDate;
        //如果查询字段列表不为空，则进行替换
        if (cols != null && !cols.equalsIgnoreCase("")) {
            sql = sql.replace("*", cols);
        }
        String tsql = COUNT_DATA_PREFIX + "tb_his_point_" + startDate;
        //根据数据参数动态生成sql语句
        if (where != null && where.length() > 0) {
            sql += " where " + where;
            tsql += " where " + where;
        }
        //根据聚合字段生成上sql语句
        if (groupby != null && groupby.length() > 0) {
            sql += " group by " + groupby;
            tsql += " group by " + groupby;
        }
        //根据排序参数生成sql语句
        if (orderby != null && orderby.length() > 0) {
            if ("true".equalsIgnoreCase(desc)) {
                sql += " order by " + orderby + " desc";
            } else {
                sql += " order by " + orderby + " asc";
            }

        }

        //添加分页限制
        sql += " LIMIT " + (page - 1) * rows + "," + rows;
        //拼接最终的sql语句
        System.out.println("[debug]" + sql + "\n" + tsql);
        //执行最终sql语句
        JSONArray data = super.queryArray(sql);
        //查询总记录数
        JSONArray total = super.queryArray(tsql);
        int all_num = 0;
        //如果没有groupby语句，总数就是查询出来的total字段
        if (groupby == null) {
            for (int i = 0; i < total.size(); i++) {
                all_num += total.getJSONObject(i).getIntValue("TOTAL");
            }
        } else {
            //如果含有groupby子句，总数就是返回的记录条数
            all_num = total.size();
        }

        //返回查询结果
        JSONObject res = new JSONObject();
        res.put("data", data);
        res.put("total", all_num);
        System.out.println("[query result]" + res.toString());
        return res;
    }

    /**
     * 定时任务，将前一天警报表中的记录加入到中间表
     *
     * @param date
     * @return
     */
    public String insertAlarms(String date) {
        int result = -1;
        String sql1 = "insert into tb_sum_alarms_outside (team_id, name, info, date, num) select team_id, name, info, date_format(time,'%Y-%c-%d') as date, COUNT(team_id) num  from tb_alarms_" + date + " where name='越界报警' GROUP BY team_id";
        result = super.insert(sql1);
        String sql2 = "insert into tb_sum_alarms_train (team_id, name, info, date, num) select team_id, name, info, date_format(time,'%Y-%c-%d') as date, COUNT(team_id) num  from tb_alarms_" + date + " where name='列车报警' GROUP BY team_id";
        result = super.insert(sql2);
        String sql3 = "insert into tb_sum_alarms_heart (team_id, name, info, date, num) select team_id, name, info, date_format(time,'%Y-%c-%d') as date, COUNT(team_id) num  from tb_alarms_" + date + " where name='心率报警' GROUP BY team_id";
        result = super.insert(sql3);
        String sql4 = "insert into tb_sum_alarms_watch (team_id, name, info, date, num) select team_id, name, info, date_format(time,'%Y-%c-%d') as date, COUNT(team_id) num  from tb_alarms_" + date + " where name='腕表异常' GROUP BY team_id";
        result = super.insert(sql4);
        return "";
    }

    /*
    * 函数名称：getDefinedIndex
    * 函数功能：查询指定指标的实时数据
    * 输入参数：index_id:指标唯一编号
    * 输出参数：String
    * 作者：douzf
    * 日期：2018-12-28
     */
    public String getDefinedIndex(int index_id) {
        String val = null;
        //从数据源表中查询指标定义
        String index_sql = "select def_sql from tb_data_source where id = ?";
        JSONArray array = super.queryArray(index_sql, index_id);
        if (array != null && array.size() > 0) {
            JSONObject obj = array.getJSONObject(0);
            String def_sql = obj.getString("def_sql");
            //执行指标定义的ｓｑｌ语句
            if (def_sql != null) {
                JSONArray res = super.queryArray(def_sql);
                if (res != null && res.size() > 0) {
                    //取出第一个查询到的值
                    JSONObject myobj = res.getJSONObject(0);
                    Collection set = (Collection) myobj.values();
                    Iterator itr = set.iterator();
                    if (itr.hasNext()) {
                        val = (String) itr.next();
                    }
                }
            }
        }
        //返回结果
        return val;
    }

    /*
    * 函数名称：getDefinedIndez
    * 函数功能：查询指定指标的实时数据
    * 输入参数：index_id:指标唯一编号
    * 输出参数：String
    * 作者：douzf
    * 日期：2018-12-28
     */
    public JSONArray getDefinedIndez(int index_id) {
        JSONArray val = null;
        //从数据源表中查询指标定义
        String index_sql = "select def_sql from tb_data_source where id = ?";
        JSONArray array = super.queryArray(index_sql, index_id);
        if (array != null && array.size() > 0) {
            JSONObject obj = array.getJSONObject(0);
            String def_sql = obj.getString("def_sql");
            //执行指标定义的ｓｑｌ语句
            if (def_sql != null) {
                val = super.queryArray(def_sql);
            }
        }
        //返回结果
        return val;
    }

    /*
    * 函数名称：laodCurrentDapiao
    * 函数功能：加载当天导入的大票数据
    * 输入参数：String period：期别
    * 输出参数：JSONArray
    * 作者：douzf
    * 日期：2019-07-21
     */
    public JSONArray laodCurrentDapiao(String period) {
        String sql = " select distinct(checi) as dapiao, min(shunwei) shunwei,chehao, max(time) as time, qibie, kuangfa_time from tb_dapiao  where  curdate() - date(time) < 2 and qibie = ? group by checi";
        return super.queryArray(sql, period);
    }

    /*
     *函数名称：queryPdcData1
     *函数功能：查询数据
     *输入参数：int which,String beginTime,String endTime
     *输出参数：JSONArray
     */
    public JSONArray queryPdcData1(String which, String beginTime, String endTime) {
        String theYear = "", theYearMonth = "";
        if ((which.equals("2") || which.equals("3")) && beginTime != null) {
            String[] keys = beginTime.split("-");
            theYear = keys[0];
            theYearMonth = keys[0].concat(keys[1]);
        }
        String sql = "";
        JSONArray array = null;
        //根据输入的编号组织sql语句
        switch (which) {
            case "1"://查询时时数据
                sql = "SELECT device_name,field_name,field_value,get_time FROM tb_meter "
                        + "WHERE PHASE='P1' AND device_name IN ('C3','C7A','C7B','COAL') "
                        + "UNION "
                        + "SELECT device_name,field_name,field_value,get_time FROM tb_schneider "
                        + "WHERE PHASE='P1' AND field_name IN ('DB.I413','DB.I418','DB.MW00221','DB.MW00222','DB.IW157','DB.M45','DB.M46','state')";

                array = super.queryArray(sql);
                break;
            case "2"://查询历史数据
                sql = "SELECT * FROM (SELECT device_name,field_name,field_value,get_time FROM tb_meter_" + theYear
                        + " WHERE PHASE='P1' AND device_name IN ('C3','C7A','C7B','COAL') AND field_name IN ('flow_value','instant_value') AND get_time BETWEEN ? AND ? "
                        + " UNION "
                        + " SELECT device_name,field_name,field_value,get_time FROM tb_schneider_p1_" + theYearMonth
                        + " WHERE field_name = 'DB.IW157' AND get_time BETWEEN ? AND ?) t ORDER BY get_time ";

                array = super.queryArray(sql, beginTime, endTime, beginTime, endTime);
                //如果记录数大于300，则按抽样取数法返回300条左右的记录，确保前端性能
                int arraySize = array.size();
                if (arraySize > 300) {
                    int shang = arraySize / 300;
                    List list = new ArrayList();
                    for (int i = 0; i < arraySize; i++) {
                        if (i % shang == 0) {
                            list.add(array.get(i));
                        }
                    }
                    array = new JSONArray(list);
                }
                break;
            case "3"://统计历史数据
                sql = "SELECT device_name,field_name,MIN(field_value) flow_min,MAX(field_value)  flow_max,AVG(field_value) flow_avg FROM tb_meter_" + theYear
                        + " WHERE PHASE='P1' AND device_name IN ('C3','C7A','C7B','COAL') AND  field_name IN ('flow_value','instant_value') AND get_time BETWEEN ? AND ? "
                        + " GROUP BY device_name,field_name "
                        + " UNION "
                        + " SELECT device_name,field_name,MIN(field_value) flow_min,MAX(field_value)  flow_max,AVG(field_value) flow_avg FROM tb_schneider_p1_" + theYearMonth
                        + " WHERE field_name = 'DB.IW157' AND get_time BETWEEN ? AND ? "
                        + " GROUP BY device_name,field_name";

                array = super.queryArray(sql, beginTime, endTime, beginTime, endTime);
                break;
            case "4"://获取一期 煤区:辅助区的比例值
                sql = "SELECT t1.para_name key1,t2.para_name key2,t1.para_value value1,t2.para_value value2 "
                        + "FROM tb_parameters t1 INNER JOIN tb_parameters t2 ON LEFT(t1.para_name,6)=LEFT(t2.para_name,6) "
                        + "WHERE t1.qibie=1 AND t1.para_name<>t2.para_name";

                array = super.queryArray(sql);
                break;
            default:
                return null;
        }

        System.out.println("sql:" + sql);
        return array;
    }

    /*
     *函数名称：queryPdcData3
     *函数功能：查询数据
     *输入参数：int which,String beginTime,String endTime
     *输出参数：JSONArray
     */
    public JSONArray queryPdcData3(String which, String beginTime, String endTime) {
        String theYear = "";
        if (beginTime != null) {
            String[] keys = beginTime.split("-");
            theYear = keys[0];
        }
        String sql = "";
        JSONArray array = null;
        //根据输入的编号组织sql语句
        switch (which) {
            case "1"://查询实时数据
                sql = "SELECT device_name,field_name,field_value,get_time FROM tb_meter "
                        + "WHERE PHASE='P3' AND device_name IN ('P7A_P3_ES','P7B_P3_ES') "
                        + "UNION "
                        + "SELECT device_name,field_name,field_value,get_time FROM tb_schneider "
                        + "WHERE PHASE='P3' AND (field_name IN ('DB7A_AT','DB7A_BT','DB7B_AT','DB7B_BT','C5_ALM','C5_BLM','state') OR field_name LIKE 'L%A_LW' OR field_name LIKE 'L%B_LW') ";

                array = super.queryArray(sql);
                break;
            case "2"://查询历史数据
                sql = "SELECT device_name,field_name,field_value,get_time FROM tb_meter_" + theYear
                        + " WHERE PHASE='P3' AND device_name IN ('P7A_P3_ES','P7B_P3_ES') AND field_name IN ('flow_value','speed_value') AND get_time BETWEEN ? AND ? order by get_time ";

                array = super.queryArray(sql, beginTime, endTime);
                //如果记录数大于300，则按抽样取数法返回300条左右的记录，确保前端性能
                int arraySize = array.size();
                if (arraySize > 300) {
                    int shang = arraySize / 300;
                    List list = new ArrayList();
                    for (int i = 0; i < arraySize; i++) {
                        if (i % shang == 0) {
                            list.add(array.get(i));
                        }
                    }
                    array = new JSONArray(list);
                }
                break;
            case "3"://统计历史数据
                sql = "SELECT device_name,field_name,MIN(field_value) flow_min,MAX(field_value)  flow_max,AVG(field_value) flow_avg FROM tb_meter_" + theYear
                        + " WHERE PHASE='P3' AND device_name IN ('P7A_P3_ES','P7B_P3_ES') AND field_name IN ('flow_value','speed_value') AND get_time BETWEEN ? AND ? "
                        + " GROUP BY device_name,field_name ";

                array = super.queryArray(sql, beginTime, endTime);
                break;
            case "4"://获取三期 煤区:辅助区的比例值
                sql = "SELECT t1.para_name key1,t2.para_name key2,t1.para_value value1,t2.para_value value2 "
                        + "FROM tb_parameters t1 INNER JOIN tb_parameters t2 ON LEFT(t1.para_name,7)=LEFT(t2.para_name,7) "
                        + "WHERE t1.qibie=3 AND t1.para_name<>t2.para_name";

                array = super.queryArray(sql);
                break;
            default:
                return null;
        }

        System.out.println("sql:" + sql);
        return array;
    }

    /*
    * 函数名称：queryMeterCurve
    * 函数功能：查询指定车次和矿别下的采样称重次数
    * 输入参数：String qibie：期别,String train_no：车次,String kuangbie：矿别
    * 输出参数：JSONObject
    * 作者：yx
    * 日期：2020-01-03
     */
    public JSONObject queryMeterCurve(String qibie, String train_no, String kuangbie) {
        String sql = "SELECT qibie,train_no,kuangbie,MAX(assay_id) max_assay_id FROM tb_assaying_record WHERE qibie=? AND train_no=? AND kuangbie=? GROUP BY qibie,train_no,kuangbie";
        return super.queryObject(sql, qibie, train_no, kuangbie);
    }

    public JSONArray queryOilHisData(String sTableName, String sCondition) {
        String sql = "select * from " + sTableName + " where " + sCondition + " ORDER BY get_time desc";
        return queryArray(sql);
    }

    /*
    * 函数名称：queryHaoMeiLiang
    * 函数功能：查询指定时间的耗煤量
    * 输入参数：int qibie:期别，0为全场，1为一二期，3为三期；
                String start_time：开始时间；
                String end_time：结束时间
    * 输出参数：JSONArray
    * 作者：douzf
    * 日期：2020-07-30
     */
    public JSONArray queryHaoMeiLiang(int qibie, String start_time, String end_time) throws ParseException {
        //获取最近一次的盘点月份
        String pandian_month_sql = "SELECT MAX(riqi) riqi FROM tb_month_pandian";
        //月度盘点表
        //全场
        String pd_total_sql = "SELECT t1.riqi, t1.total_weight, "
                + "t2.total_weight yanmei_weight, "
                + "t3.total_weight wuyanmei_weight, "
                + "t4.total_weight jingjimei_weight  "
                + "from (select riqi, round(SUM(weight), 2) total_weight "
                + "FROM tb_month_pandian WHERE riqi IN (SELECT MAX(riqi) riqi "
                + "FROM tb_month_pandian)) t1 left join "
                + "(SELECT riqi, round(SUM(weight), 2) total_weight "
                + "FROM tb_month_pandian WHERE meizhong='烟煤' AND riqi "
                + "IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)) t2 "
                + "on t1.riqi = t2.riqi left join "
                + "(SELECT riqi, round(SUM(weight), 2) total_weight "
                + "FROM tb_month_pandian WHERE meizhong='无烟煤' AND riqi "
                + "IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)) t3 on "
                + "t1.riqi = t3.riqi left join (SELECT riqi, "
                + "round(SUM(weight), 2) total_weight "
                + "FROM tb_month_pandian WHERE meizhong='经济煤' AND riqi "
                + "IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)) t4 "
                + "on t1.riqi = t4.riqi";

        //一二期
        String pd_p1_sql = "SELECT t1.riqi, t1.total_weight, "
                + "t2.total_weight yanmei_weight, "
                + "t3.total_weight wuyanmei_weight, "
                + "t4.total_weight jingjimei_weight  "
                + "from (SELECT riqi, round(SUM(weight), 2) total_weight "
                + "FROM tb_month_pandian WHERE riqi "
                + "IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)"
                + " AND meichang_id in ('A1', 'A2', 'A3', 'A4', 'B1', 'B2', "
                + "'B3', 'B4', 'C1', 'C2', 'C3')) t1 left join "
                + "(SELECT riqi, round(SUM(weight), 2) total_weight "
                + "FROM tb_month_pandian WHERE meizhong='烟煤' AND riqi "
                + "IN (SELECT MAX(riqi) riqi FROM tb_month_pandian) "
                + "AND meichang_id in ('A1', 'A2', 'A3', 'A4', 'B1', 'B2', "
                + "'B3', 'B4', 'C1', 'C2', 'C3')) t2 on t1.riqi = t2.riqi "
                + "left join (SELECT riqi, round(SUM(weight), 2) total_weight "
                + "FROM tb_month_pandian WHERE meizhong='无烟煤' AND riqi "
                + "IN (SELECT MAX(riqi) riqi FROM tb_month_pandian) "
                + "AND meichang_id in ('A1', 'A2', 'A3', 'A4', 'B1', 'B2', "
                + "'B3', 'B4', 'C1', 'C2', 'C3')) t3 on t1.riqi = t3.riqi "
                + "left join (SELECT riqi, round(SUM(weight), 2) total_weight "
                + "FROM tb_month_pandian WHERE meizhong='经济煤' AND riqi "
                + "IN (SELECT MAX(riqi) riqi FROM tb_month_pandian) "
                + "AND meichang_id in ('A1', 'A2', 'A3', 'A4', 'B1', 'B2', "
                + "'B3', 'B4', 'C1', 'C2', 'C3')) t4 on t1.riqi = t4.riqi";

        //三期
        String pd_p3_sql = "SELECT t1.riqi, t1.total_weight, "
                + "t2.total_weight yanmei_weight, "
                + "t3.total_weight wuyanmei_weight, "
                + "t4.total_weight jingjimei_weight  "
                + "from (SELECT riqi, round(SUM(weight), 2) total_weight "
                + "FROM tb_month_pandian WHERE riqi IN (SELECT MAX(riqi) riqi "
                + "FROM tb_month_pandian) AND meichang_id in ('D1', 'D2', 'D3', "
                + "'E1', 'E2', 'E3', 'F1', 'F2', 'F3', 'F4', 'G1', 'G2', 'G3', "
                + "'G4')) t1 left join (SELECT riqi, "
                + "round(SUM(weight), 2) total_weight "
                + "FROM tb_month_pandian WHERE meizhong='烟煤' AND riqi "
                + "IN (SELECT MAX(riqi) riqi FROM tb_month_pandian) "
                + "AND meichang_id in ('D1', 'D2', 'D3', 'E1', 'E2', 'E3', 'F1',"
                + " 'F2', 'F3', 'F4', 'G1', 'G2', 'G3', 'G4')) t2 "
                + "on t1.riqi = t2.riqi left join (SELECT riqi, "
                + "round(SUM(weight), 2) total_weight FROM tb_month_pandian "
                + "WHERE meizhong='无烟煤' AND riqi IN (SELECT MAX(riqi) riqi "
                + "FROM tb_month_pandian) AND meichang_id in ('D1', 'D2', 'D3', "
                + "'E1', 'E2', 'E3', 'F1', 'F2', 'F3', 'F4', 'G1', 'G2', 'G3',"
                + " 'G4')) t3 on t1.riqi = t3.riqi left join (SELECT riqi, "
                + "round(SUM(weight), 2) total_weight FROM tb_month_pandian "
                + "WHERE meizhong='经济煤' AND riqi IN (SELECT MAX(riqi) riqi "
                + "FROM tb_month_pandian) AND meichang_id in ('D1', 'D2', 'D3', "
                + "'E1', 'E2', 'E3', 'F1', 'F2', 'F3', 'F4', 'G1', 'G2', 'G3', "
                + "'G4')) t4 on t1.riqi = t4.riqi";

        //翻车机进煤
        //全厂翻车机进煤
        String fcj_total_sql = "select t1.report_date, t1.total_weight, "
                + "t2.total_weight as yanmei_weight,"
                + "t3.total_weight as wuyanmei_weight,"
                + "t4.total_weight as jingjimei_weight "
                + "from  (SELECT DATE(update_time) report_date, "
                + "ROUND(SUM(jinzhong), 2) total_weight "
                + "FROM tb_fanche_temp_result "
                + "WHERE update_time >= ? AND update_time <= ? "
                + "GROUP BY DATE(update_time)) t1 left join "
                + "(SELECT DATE(update_time) report_date, "
                + "ROUND(SUM(jinzhong), 2) total_weight "
                + "FROM tb_fanche_temp_result "
                + "WHERE update_time >= ? AND update_time <= ? "
                + "AND  meizhong = '烟煤' GROUP BY DATE(update_time)) t2 "
                + "on t1.report_date = t2.report_date left join "
                + "(SELECT DATE(update_time) report_date, "
                + "ROUND(SUM(jinzhong), 2) total_weight "
                + "FROM tb_fanche_temp_result "
                + "WHERE update_time >= ? AND update_time <= ? AND "
                + "meizhong = '无烟煤' GROUP BY DATE(update_time)) t3 "
                + "on t1.report_date = t3.report_date left join "
                + "(SELECT DATE(update_time) report_date, "
                + "ROUND(SUM(jinzhong), 2) total_weight "
                + "FROM tb_fanche_temp_result "
                + "WHERE update_time >= ? AND update_time <= ? AND "
                + "meizhong = '经济煤' GROUP BY DATE(update_time)) t4 "
                + "on t1.report_date = t4.report_date";

        //一二期翻车机进煤
        String fcj_p1_sql = "select t1.report_date, t1.total_weight, "
                + "t2.total_weight as yanmei_weight,"
                + "t3.total_weight as wuyanmei_weight,"
                + "t4.total_weight as jingjimei_weight "
                + "from (SELECT DATE(update_time) report_date, "
                + "ROUND(SUM(jinzhong), 2) total_weight "
                + "FROM tb_fanche_temp_result "
                + "WHERE update_time >= ? AND update_time <= ? AND "
                + "qibie=1  GROUP BY DATE(update_time)) t1 left join "
                + "(SELECT DATE(update_time) report_date, "
                + "ROUND(SUM(jinzhong), 2) total_weight "
                + "FROM tb_fanche_temp_result "
                + "WHERE update_time >= ? AND update_time <= ? AND "
                + "meizhong = '烟煤' AND qibie=1 "
                + "GROUP BY DATE(update_time)) t2 "
                + "on t1.report_date = t2.report_date left join "
                + "(SELECT DATE(update_time) report_date, "
                + "ROUND(SUM(jinzhong), 2) total_weight "
                + "FROM tb_fanche_temp_result "
                + "WHERE update_time >= ? AND update_time <= ? AND "
                + "meizhong = '无烟煤' AND qibie=1 "
                + "GROUP BY DATE(update_time)) t3 "
                + "on t1.report_date = t3.report_date left join "
                + "(SELECT DATE(update_time) report_date, "
                + "ROUND(SUM(jinzhong), 2) total_weight "
                + "FROM tb_fanche_temp_result "
                + "WHERE update_time >= ? AND update_time <= ? AND "
                + "meizhong = '经济煤' AND qibie=1 "
                + "GROUP BY DATE(update_time)) t4 "
                + "on t1.report_date = t4.report_date";

        //三期翻车机进煤
        String fcj_p3_sql = "select t1.report_date, t1.total_weight, "
                + "t2.total_weight as yanmei_weight,"
                + "t3.total_weight as wuyanmei_weight,"
                + "t4.total_weight as jingjimei_weight "
                + "from (SELECT DATE(update_time) report_date, "
                + "ROUND(SUM(jinzhong), 2) total_weight "
                + "FROM tb_fanche_temp_result "
                + "WHERE update_time >= ? AND update_time <= ? "
                + "AND   qibie=3  GROUP BY DATE(update_time)) t1 left join "
                + "(SELECT DATE(update_time) report_date, "
                + "ROUND(SUM(jinzhong), 2) total_weight "
                + "FROM tb_fanche_temp_result "
                + "WHERE update_time >= ? AND update_time <= ? "
                + "AND   meizhong = '烟煤' AND qibie=3 "
                + "GROUP BY DATE(update_time)) t2 "
                + "on t1.report_date = t2.report_date left join "
                + "(SELECT DATE(update_time) report_date, "
                + "ROUND(SUM(jinzhong), 2) total_weight "
                + "FROM tb_fanche_temp_result "
                + "WHERE update_time >= ? AND update_time <= ? "
                + "AND   meizhong = '无烟煤' AND qibie=3 "
                + "GROUP BY DATE(update_time)) t3 "
                + "on t1.report_date = t3.report_date left join "
                + "(SELECT DATE(update_time) report_date, "
                + "ROUND(SUM(jinzhong), 2) total_weight "
                + "FROM tb_fanche_temp_result "
                + "WHERE update_time >= ? AND update_time <= ? "
                + "AND   meizhong = '经济煤' AND qibie=3 "
                + "GROUP BY DATE(update_time)) t4 "
                + "on t1.report_date = t4.report_date";

        //船煤
        String boat_p1_sql = "select t1.report_date, t1.total_weight, "
                + "t2.total_weight as yanmei_weight,"
                + "t3.total_weight as wuyanmei_weight,"
                + "t4.total_weight as jingjimei_weight "
                + "from (SELECT  DATE(end_time) report_date,"
                + "ROUND(SUM(naked_weight), 2) total_weight  "
                + "FROM tb_boat_coal WHERE  end_time >= ? AND end_time <= ?  "
                + "GROUP BY DATE(end_time)) t1 left join "
                + "(SELECT  DATE(end_time) report_date, "
                + "ROUND(SUM(naked_weight), 2) total_weight  "
                + "FROM tb_boat_coal WHERE  end_time >= ? AND end_time <= ?  "
                + "AND meizhong = '烟煤' GROUP BY DATE(end_time)) t2 "
                + "on t1.report_date = t2.report_date left join "
                + "(SELECT  DATE(end_time) report_date, "
                + "ROUND(SUM(naked_weight), 2) total_weight  "
                + "FROM tb_boat_coal WHERE  end_time >= ? AND end_time <= ?  "
                + "AND meizhong = '无烟煤' "
                + "GROUP BY DATE(end_time)) t3 "
                + "on t1.report_date = t3.report_date left join "
                + "(SELECT  DATE(end_time) report_date, "
                + "ROUND(SUM(naked_weight), 2) total_weight  "
                + "FROM tb_boat_coal WHERE  end_time >= ? AND end_time <= ? "
                + "AND meizhong = '经济煤' GROUP BY DATE(end_time)) t4 "
                + "on t1.report_date = t4.report_date";

        //耗煤
        //全厂耗煤
        String haomei_total_sql = "select t1.rq as report_date, "
                + "t1.total_weight, "
                + "t2.total_weight as yanmei_weight,"
                + "t3.total_weight as wuyanmei_weight,"
                + "t4.total_weight as jingjimei_weight "
                + "from (SELECT rq, ROUND(SUM(sml), 2) AS total_weight "
                + "FROM tb_upload_pdc WHERE  rq >= ? AND rq <= ? GROUP BY rq) t1 "
                + "left join (SELECT rq, ROUND(SUM(sml), 2) AS total_weight "
                + "FROM tb_upload_pdc WHERE  rq >= ? AND rq <= ? "
                + "AND yslx IN (SELECT meichang_id "
                + "FROM tb_month_pandian WHERE meizhong='烟煤'  "
                + "AND  riqi IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)) "
                + "GROUP BY rq) t2 on t1.rq = t2.rq left join "
                + "(SELECT rq, ROUND(SUM(sml), 2) AS total_weight "
                + "FROM tb_upload_pdc WHERE  rq >= ? AND rq <= ? "
                + "AND yslx IN (SELECT meichang_id FROM tb_month_pandian "
                + "WHERE meizhong='无烟煤'  AND  riqi IN (SELECT MAX(riqi) riqi "
                + "FROM tb_month_pandian)) GROUP BY rq) t3 on t1.rq = t3.rq left "
                + "join (SELECT rq, ROUND(SUM(sml), 2) AS total_weight "
                + "FROM tb_upload_pdc WHERE  rq >= ? AND rq <= ? "
                + "AND yslx IN (SELECT meichang_id FROM tb_month_pandian "
                + "WHERE meizhong='经济煤'  AND  riqi "
                + "IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)) "
                + "GROUP BY rq) t4 on t1.rq = t4.rq";
        //一二期耗煤
        String haomei_p1_sql = "select t1.rq as report_date, t1.total_weight, "
                + "t2.total_weight as yanmei_weight,"
                + "t3.total_weight as wuyanmei_weight,"
                + "t4.total_weight as jingjimei_weight "
                + "from (SELECT rq, ROUND(SUM(sml), 2) AS total_weight "
                + "FROM tb_upload_pdc WHERE  rq >= ? AND rq <= ?  "
                + "AND qb = '10001' GROUP BY rq) t1 left join (SELECT rq, "
                + "ROUND(SUM(sml), 2) AS total_weight FROM tb_upload_pdc "
                + "WHERE  rq >= ? AND rq <= ?  AND qb = '10001' AND yslx "
                + "IN (SELECT meichang_id FROM tb_month_pandian "
                + "WHERE meizhong='烟煤'  AND  riqi IN (SELECT MAX(riqi) riqi "
                + "FROM tb_month_pandian)) GROUP BY rq) t2 on t1.rq = t2.rq "
                + "left join (SELECT rq, ROUND(SUM(sml), 2) AS total_weight "
                + "FROM tb_upload_pdc WHERE  rq >= ? AND rq <= ?  "
                + "AND qb = '10001' AND yslx IN (SELECT meichang_id "
                + "FROM tb_month_pandian WHERE meizhong='无烟煤'  AND  riqi "
                + "IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)) "
                + "GROUP BY rq) t3 on t1.rq = t3.rq left join "
                + "(SELECT rq, ROUND(SUM(sml), 2) AS total_weight "
                + "FROM tb_upload_pdc WHERE  rq >= ? AND rq <= ?  "
                + "AND qb = '10001' AND yslx IN (SELECT meichang_id "
                + "FROM tb_month_pandian WHERE meizhong='经济煤'  "
                + "AND  riqi IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)) "
                + "GROUP BY rq) t4 on t1.rq = t4.rq";
        //三期耗煤
        String haomei_p3_sql = "select t1.rq as report_date, t1.total_weight, "
                + "t2.total_weight as yanmei_weight,"
                + "t3.total_weight as wuyanmei_weight,"
                + "t4.total_weight as jingjimei_weight "
                + "from (SELECT rq, ROUND(SUM(sml), 2) AS total_weight "
                + "FROM tb_upload_pdc WHERE  rq >= ? AND rq <= ?  "
                + "AND qb = '10002' GROUP BY rq) t1 left join "
                + "(SELECT rq, ROUND(SUM(sml), 2) AS total_weight "
                + "FROM tb_upload_pdc WHERE  rq >= ? AND rq <= ?  "
                + "AND qb = '10002' AND yslx IN (SELECT meichang_id "
                + "FROM tb_month_pandian WHERE meizhong='烟煤'  AND  "
                + "riqi IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)) "
                + "GROUP BY rq) t2 on t1.rq = t2.rq left join (SELECT rq, "
                + "ROUND(SUM(sml), 2) AS total_weight FROM tb_upload_pdc "
                + "WHERE  rq >= ? AND rq <= ?  AND qb = '10002' AND yslx "
                + "IN (SELECT meichang_id FROM tb_month_pandian "
                + "WHERE meizhong='无烟煤'  AND  riqi IN (SELECT MAX(riqi) riqi "
                + "FROM tb_month_pandian)) GROUP BY rq) t3 "
                + "on t1.rq = t3.rq left join (SELECT rq, "
                + "ROUND(SUM(sml), 2) AS total_weight FROM tb_upload_pdc "
                + "WHERE  rq >= ? AND rq <= ?  AND qb = '10002' "
                + "AND yslx IN (SELECT meichang_id FROM tb_month_pandian "
                + "WHERE meizhong='经济煤'  AND  riqi "
                + "IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)) "
                + "GROUP BY rq) t4 on t1.rq = t4.rq";
        String pd_month = "";
        JSONArray pandian = null;
        JSONArray fcj_jinmeiliang = null;
        JSONArray haomeiliang = null;
        JSONArray boat_jinmeiliang = null;
        //查询最近一次盘点月份
        JSONArray pd_month_array = queryArray(pandian_month_sql);
        if (pd_month_array != null && pd_month_array.size() > 0) {
            pd_month = pd_month_array.getJSONObject(0).getString("riqi");
            //月份补齐为月底最后一天
            pd_month += "-31";
        } else {
            pd_month = start_time;
        }
        //按照期别不同执行不同的统计sql
        switch (qibie) {
            case 0:
                //全厂
                //先查询月度盘点数据
                pandian = queryArray(pd_total_sql);
                //翻车机进煤量
                fcj_jinmeiliang = queryArray(fcj_total_sql, pd_month, end_time, pd_month, end_time, pd_month, end_time, pd_month, end_time);
                //船运煤进煤量
                boat_jinmeiliang = queryArray(boat_p1_sql, pd_month, end_time, pd_month, end_time, pd_month, end_time, pd_month, end_time);
                //耗煤量
                haomeiliang = queryArray(haomei_total_sql, pd_month, end_time, pd_month, end_time, pd_month, end_time, pd_month, end_time);
                System.out.println("[pandian]" + pandian.toJSONString());
                System.out.println("[fcj]" + fcj_jinmeiliang.toJSONString());
                System.out.println("[boat]" + boat_jinmeiliang.toJSONString());
                System.out.println("[haomei]" + haomeiliang.toJSONString());
                break;
            case 1:
                //一二期
                //先查询月度盘点数据
                pandian = queryArray(pd_p1_sql);
                //翻车机进煤量
                fcj_jinmeiliang = queryArray(fcj_p1_sql, pd_month, end_time, pd_month, end_time, pd_month, end_time, pd_month, end_time);
                //船运煤进煤量
                boat_jinmeiliang = queryArray(boat_p1_sql, pd_month, end_time, pd_month, end_time, pd_month, end_time, pd_month, end_time);
                //耗煤量
                haomeiliang = queryArray(haomei_p1_sql, pd_month, end_time, pd_month, end_time, pd_month, end_time, pd_month, end_time);
                break;
            case 3:
                //三期
                //先查询月度盘点数据
                pandian = queryArray(pd_p3_sql);
                //翻车机进煤量
                fcj_jinmeiliang = queryArray(fcj_p3_sql, pd_month, end_time, pd_month, end_time, pd_month, end_time, pd_month, end_time);
                //耗煤量
                haomeiliang = queryArray(haomei_p3_sql, pd_month, end_time, pd_month, end_time, pd_month, end_time, pd_month, end_time);
                break;
            default:
                break;
        }
        //日期格式
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        //为了查询比较快，将翻车机进煤量保存到一个哈希表中
        HashMap fcj_map = new HashMap();
        //船运煤保存到哈希表中
        HashMap boat_map = new HashMap();
        //保存耗煤量
        if (fcj_jinmeiliang != null) {
            for (int i = 0; i < fcj_jinmeiliang.size(); i++) {
                JSONObject jml = fcj_jinmeiliang.getJSONObject(i);
                fcj_map.put(jml.getString("report_date"), jml);
            }
        }
        //保存船运煤进煤量到哈希表
        if (boat_jinmeiliang != null) {
            for (int j = 0; j < boat_jinmeiliang.size(); j++) {
                JSONObject ysl = boat_jinmeiliang.getJSONObject(j);
                boat_map.put(ysl.getString("report_date"), ysl);
            }
        }
        //存煤量
        JSONArray cunmeiliang = new JSONArray();
        //根据查询获得盘点数据，进煤量数据和耗煤量数据计算存煤量
        JSONObject pdl = null;
        if (pandian != null) {
            pdl = pandian.getJSONObject(0);
        }
        //总量
        float total_weight = 0;
        //烟煤量
        float yanmei_weight = 0;
        //无烟煤量
        float wuyanmei_weight = 0;
        //经济煤量
        float jingjimei_weight = 0;
        //获取盘点数据
        if (pdl != null) {
            //总量
            total_weight += pdl.getFloat("total_weight");
            //烟煤量
            yanmei_weight += pdl.getFloat("yanmei_weight");
            //无烟煤量
            wuyanmei_weight += pdl.getFloat("wuyanmei_weight");
            //经济煤量
            jingjimei_weight += pdl.getFloat("jingjimei_weight");
        }
        for (int k = 0; k < haomeiliang.size(); k++) {
            //日期
            String report_date = null;

            //获取一天的翻车机进煤量
            JSONObject hml = haomeiliang.getJSONObject(k);
            //加上翻车机进煤量
            if (hml != null) {
                report_date = hml.getString("report_date");
                //总量
                total_weight -= hml.getFloat("total_weight");
                //烟煤量
                yanmei_weight -= hml.getFloat("yanmei_weight");
                //无烟煤量
                wuyanmei_weight -= hml.getFloat("wuyanmei_weight");
                //经济煤量
                jingjimei_weight -= hml.getFloat("jingjimei_weight");
            } else {
                continue;
            }

            //获取船运煤
            JSONObject cym = (JSONObject) boat_map.get(report_date);
            //如果船运煤量不为空，就加上船运煤的进煤量
            if (cym != null) {
                //总量
                total_weight += cym.getFloat("total_weight");
                //烟煤量
                yanmei_weight += cym.getFloat("yanmei_weight");
                //无烟煤量
                wuyanmei_weight += cym.getFloat("wuyanmei_weight");
                //经济煤量
                jingjimei_weight += cym.getFloat("jingjimei_weight");
            }

            //获取耗煤量
            JSONObject gcj_jml = (JSONObject) fcj_map.get(report_date);
            //如果耗煤量不为空，就减去耗煤量
            if (gcj_jml != null) {
                //总量
                total_weight += gcj_jml.getFloat("total_weight");
                //烟煤量
                yanmei_weight += gcj_jml.getFloat("yanmei_weight");
                //无烟煤量
                wuyanmei_weight += gcj_jml.getFloat("wuyanmei_weight");
                //经济煤量
                jingjimei_weight += gcj_jml.getFloat("jingjimei_weight");
            }

            //判断时间窗口是否在start_time之后，如果不是，则忽略该组数据
            Date cml_date = sdf.parse(report_date);
            Date start_date = sdf.parse(start_time);
            if (cml_date.before(start_date)) {
                System.out.println("[ignore date]" + cml_date);
                continue;
            }
            //创建存煤量对象
            JSONObject cml = new JSONObject();
            //日期
            cml.put("report_date", report_date);
            //总量
            cml.put("total_weight", total_weight > 0 ? total_weight : 0);
            //烟煤量
            cml.put("yanmei_weight", yanmei_weight > 0 ? yanmei_weight : 0);
            //无烟煤量
            cml.put("wuyanmei_weight", wuyanmei_weight > 0 ? wuyanmei_weight : 0);
            //经济煤量
            cml.put("jingjimei_weight", jingjimei_weight > 0 ? jingjimei_weight : 0);
            //烟煤比例
            cml.put("yanmei_rate", String.format("%.2f",
                    total_weight > 0 ? (yanmei_weight / total_weight) * 100 : 0) + "%");
            //无烟煤比例
            cml.put("wuyanmei_rate", String.format("%.2f",
                    total_weight > 0 ? (wuyanmei_weight / total_weight) * 100 : 0) + "%");
            //经济煤比例
            cml.put("jingjimei_rate", String.format("%.2f",
                    total_weight > 0 ? (jingjimei_weight / total_weight) * 100 : 0) + "%");
            //将存煤量对象添加到数组当中
            cunmeiliang.add(cml);
        }
        //返回查询结果
        return cunmeiliang;
    }

    /*
    * 函数名称：calculateTotalCunmeiliang
    * 函数功能：查询特定实际拿的存煤量
    * 输入参数：String end_time：截止时间
    * 输出参数：void
    * 作者：douzf
    * 日期：2020-09-27
     */
    public void calculateTotalCunmeiliang(String end_time) {
        //新增存煤量记录
        String exe_sql = "replace into tb_cunmei_report (report_date, phase, total_weight, yanmei_weight, wuyanmei_weight, jingjimei_weight, yanmei_rate, wuyanmei_rate, jingjimei_rate) values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        //总量盘点
        String pd_total_sql = "select round(SUM(weight), 2) total_weight FROM tb_month_pandian WHERE riqi IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)";
        //全量翻车机进煤
        String fcj_total_sql = "SELECT ROUND(SUM(jinzhong), 2) total_weight FROM tb_fanche_temp_result WHERE update_time > CONCAT((SELECT MAX(riqi) riqi FROM tb_month_pandian),  '-31') AND update_time <= ?";
        //全量船煤进煤
        String boat_total_sql = "SELECT ROUND(SUM(naked_weight), 2) total_weight FROM tb_boat_coal WHERE  end_time > CONCAT((SELECT MAX(riqi) riqi FROM tb_month_pandian),  '-31') AND end_time <= ?";
        //全量耗煤
        String hm_total_sql = "SELECT ROUND(SUM(sml), 2) AS total_weight FROM tb_upload_pdc WHERE  rq > CONCAT((SELECT MAX(riqi) riqi FROM tb_month_pandian),  '-31') AND rq <= ?";

        //烟煤盘点
        String pd_ym_sql = "SELECT riqi, round(SUM(weight), 2) total_weight FROM tb_month_pandian WHERE meizhong='烟煤' AND riqi IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)";
        //全量翻车机烟煤进煤
        String fcj_ym_sql = "SELECT ROUND(SUM(jinzhong), 2) total_weight FROM tb_fanche_temp_result WHERE update_time > CONCAT((SELECT MAX(riqi) riqi FROM tb_month_pandian),  '-31') AND update_time <= ? AND  meizhong = '烟煤'";
        //全量船煤烟煤进煤
        String boat_ym_sql = "SELECT ROUND(SUM(naked_weight), 2) total_weight  FROM tb_boat_coal WHERE  end_time > CONCAT((SELECT MAX(riqi) riqi FROM tb_month_pandian),  '-31') AND end_time <= ?  AND meizhong = '烟煤'";
        //全量烟煤耗煤
        String hm_ym_sql = "SELECT ROUND(SUM(sml), 2) AS total_weight FROM tb_upload_pdc WHERE  rq > CONCAT((SELECT MAX(riqi) riqi FROM tb_month_pandian),  '-31') AND rq <= ? AND yslx IN (SELECT meichang_id FROM tb_month_pandian WHERE meizhong='烟煤'  AND  riqi IN (SELECT MAX(riqi) riqi FROM tb_month_pandian))";

        //无烟煤盘点
        String pd_wym_sql = "SELECT riqi, round(SUM(weight), 2) total_weight FROM tb_month_pandian WHERE meizhong='无烟煤' AND riqi IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)";
        //全量翻车机无烟煤进煤
        String fcj_wym_sql = "SELECT ROUND(SUM(jinzhong), 2) total_weight FROM tb_fanche_temp_result WHERE update_time > CONCAT((SELECT MAX(riqi) riqi FROM tb_month_pandian),  '-31') AND update_time <= ? AND meizhong = '无烟煤'";
        //全量船煤无烟煤进煤
        String boat_wym_sql = "SELECT ROUND(SUM(naked_weight), 2) total_weight  FROM tb_boat_coal WHERE  end_time > CONCAT((SELECT MAX(riqi) riqi FROM tb_month_pandian),  '-31') AND end_time <= ?  AND meizhong = '无烟煤'";
        //全量无烟煤耗煤
        String hm_wym_sql = "SELECT ROUND(SUM(sml), 2) AS total_weight FROM tb_upload_pdc WHERE  rq > CONCAT((SELECT MAX(riqi) riqi FROM tb_month_pandian),  '-31') AND rq <= ? AND yslx IN (SELECT meichang_id FROM tb_month_pandian WHERE meizhong='无烟煤'  AND  riqi IN (SELECT MAX(riqi) riqi FROM tb_month_pandian))";

        //经济煤盘点
        String pd_jjm_sql = "SELECT riqi, round(SUM(weight), 2) total_weight FROM tb_month_pandian WHERE meizhong='经济煤' AND riqi IN (SELECT MAX(riqi) riqi FROM tb_month_pandian)";
        //全量翻车机经济煤进煤
        String fcj_jjm_sql = "SELECT ROUND(SUM(jinzhong), 2) total_weight FROM tb_fanche_temp_result WHERE update_time > CONCAT((SELECT MAX(riqi) riqi FROM tb_month_pandian),  '-31') AND update_time <= ? AND meizhong = '经济煤'";
        //全量船煤经济煤进煤
        String boat_jjm_sql = "SELECT ROUND(SUM(naked_weight), 2) total_weight  FROM tb_boat_coal WHERE  end_time > CONCAT((SELECT MAX(riqi) riqi FROM tb_month_pandian),  '-31') AND end_time <= ?  AND meizhong = '经济煤'";
        //全量经济煤耗煤
        String hm_jjm_sql = "SELECT ROUND(SUM(sml), 2) AS total_weight FROM tb_upload_pdc WHERE  rq > CONCAT((SELECT MAX(riqi) riqi FROM tb_month_pandian),  '-31') AND rq <= ? AND yslx IN (SELECT meichang_id FROM tb_month_pandian WHERE meizhong='经济煤'  AND  riqi IN (SELECT MAX(riqi) riqi FROM tb_month_pandian))";
        //总量
        float total_weight = 0;
        //烟煤量
        float yanmei_weight = 0;
        //无烟煤量
        float wuyanmei_weight = 0;
        //经济煤量
        float jingjimei_weight = 0;
        //总量盘点
        JSONArray res = queryArray(pd_total_sql);
        if (res != null && res.size() > 0) {
            total_weight += res.getJSONObject(0).getFloat("total_weight");
        }
        //全量翻车机进煤
        res = queryArray(fcj_total_sql, end_time);
        if (res != null && res.size() > 0) {
            total_weight += res.getJSONObject(0).getFloat("total_weight");
        }
        //全量船煤进煤
        res = queryArray(boat_total_sql, end_time);
        if (res != null && res.size() > 0) {
            total_weight += res.getJSONObject(0).getFloat("total_weight");
        }
        //全量耗煤
        res = queryArray(hm_total_sql, end_time);
        if (res != null && res.size() > 0) {
            total_weight -= res.getJSONObject(0).getFloat("total_weight");
        }
        //存煤量不可能出现负值
        if (total_weight < 0) {
            total_weight = 0;
        }

        //烟煤盘点
        res = queryArray(pd_ym_sql);
        if (res != null && res.size() > 0) {
            yanmei_weight += res.getJSONObject(0).getFloat("total_weight");
        }
        //全量翻车机烟煤进煤
        res = queryArray(fcj_ym_sql, end_time);
        if (res != null && res.size() > 0) {
            yanmei_weight += res.getJSONObject(0).getFloat("total_weight");
        }
        //全量船煤烟煤进煤
        res = queryArray(boat_ym_sql, end_time);
        if (res != null && res.size() > 0) {
            yanmei_weight += res.getJSONObject(0).getFloat("total_weight");
        }
        //全量烟煤耗煤
        res = queryArray(hm_ym_sql, end_time);
        if (res != null && res.size() > 0) {
            yanmei_weight -= res.getJSONObject(0).getFloat("total_weight");
        }
        //存煤量不可能出现负值
        if (yanmei_weight < 0) {
            yanmei_weight = 0;
        }

        //无烟煤盘点
        res = queryArray(pd_wym_sql);
        if (res != null && res.size() > 0) {
            wuyanmei_weight += res.getJSONObject(0).getFloat("total_weight");
        }
        //全量翻车机无烟煤进煤
        res = queryArray(fcj_wym_sql, end_time);
        if (res != null && res.size() > 0) {
            wuyanmei_weight += res.getJSONObject(0).getFloat("total_weight");
        }
        //全量船煤无烟煤进煤
        res = queryArray(boat_wym_sql, end_time);
        if (res != null && res.size() > 0) {
            wuyanmei_weight += res.getJSONObject(0).getFloat("total_weight");
        }
        //全量无烟煤耗煤
        res = queryArray(hm_wym_sql, end_time);
        if (res != null && res.size() > 0) {
            wuyanmei_weight -= res.getJSONObject(0).getFloat("total_weight");
        }
        //存煤量不可能出现负值
        if (wuyanmei_weight < 0) {
            wuyanmei_weight = 0;
        }

        //经济煤盘点
        res = queryArray(pd_jjm_sql);
        if (res != null && res.size() > 0) {
            jingjimei_weight += res.getJSONObject(0).getFloat("total_weight");
        }
        //全量翻车机经济煤进煤
        res = queryArray(fcj_jjm_sql, end_time);
        if (res != null && res.size() > 0) {
            jingjimei_weight += res.getJSONObject(0).getFloat("total_weight");
        }
        //全量船煤经济煤进煤
        res = queryArray(boat_jjm_sql, end_time);
        if (res != null && res.size() > 0) {
            jingjimei_weight += res.getJSONObject(0).getFloat("total_weight");
        }
        //全量经济煤耗煤
        res = queryArray(hm_jjm_sql, end_time);
        if (res != null && res.size() > 0) {
            jingjimei_weight -= res.getJSONObject(0).getFloat("total_weight");
        }
        //存煤量不可能出现负值
        if (jingjimei_weight < 0) {
            jingjimei_weight = 0;
        }

        //烟煤比例
        String yanmei_rate = String.format("%.2f",
                total_weight > 0 ? (yanmei_weight / total_weight) * 100 : 0) + "%";
        //无烟煤比例
        String wuyanmei_rate = String.format("%.2f",
                total_weight > 0 ? (wuyanmei_weight / total_weight) * 100 : 0) + "%";
        //经济煤比例
        String jingjimei_rate = String.format("%.2f",
                total_weight > 0 ? (jingjimei_weight / total_weight) * 100 : 0) + "%";
        //执行存煤新增操作
        update(exe_sql, end_time, 0, total_weight, yanmei_weight, wuyanmei_weight, jingjimei_weight, yanmei_rate, wuyanmei_rate, jingjimei_rate);
    }
    
    /*
    * 函数名称：checkUploaded
    * 函数功能：查询指定车次的计量的数据是否已经翻车并保存到了数据库中
    * 输入参数：String train_no：列车编号
    * 输出参数：boolean：如果已经有翻车数据，则返回为true，否则为false
    * 作者：douzf
    * 日期：2020-09-27
     */
    public boolean checkUploaded(String train_no, String kuangbie) {
        
        //查询翻车数据的sql语句
        String sql = "select count(*) num from tb_fanche_temp_result where pici_id = ? and kuangbie = ?";
        //执行查询语句
        JSONArray array = queryArray(sql, train_no, kuangbie);
        if (array != null) {
            //获取记录数目
            int num = array.getJSONObject(0).getIntValue("num");
            System.out.println("[debug]hepi input:train_no=" +train_no + " kuangbie=" + kuangbie + " weighted_num=" + num);
            //如果查询到的记录数大于0，则返回true，否则返回false
            if (num > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    
    /*
    * 函数名称：checkHepiApplied
    * 函数功能：查询是否已经提交过相同的合批申请
    * 输入参数：String train_no：列车编号， String kuangbie：矿别
    * 输出参数：boolean：如果已经有相同的合批申请，则返回为true，否则为false
    * 作者：douzf
    * 日期：2020-09-28
     */
    public boolean checkHepiApplied(String train_no, String kuangbie) {
        //查询翻车数据的sql语句
        String sql = "select count(*) num from tb_hepi_apply where train_no = ? and kuangbie = ?";
        //执行查询语句
        JSONArray array = queryArray(sql, train_no, kuangbie);
        if (array != null) {
            //获取记录数目
            int num = array.getJSONObject(0).getIntValue("num");
            //如果查询到的记录数大于0，则返回true，否则返回false
            if (num > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public static void main(String[] args) {
        ServletDataDao sdd = new ServletDataDao();
        Date date = new Date(System.currentTimeMillis());
        int year = date.getYear() + 1900;
        int month = date.getMonth() + 1;
        int day = date.getDate();
//        JSONArray cml = sdd.queryHaoMeiLiang(0, "2020-07-01", "2020-07-30");
//        System.out.println(cml.toJSONString());
        sdd.calculateTotalCunmeiliang("2020-07-30");
    }
}
