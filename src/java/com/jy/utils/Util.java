/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.jy.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Administrator
 */
public class Util {

    /*
    * @函数名称：setScale
    * @函数描述：将double型数值的小数点后保留两位，四舍五入，并返回新值
    * @输入： double
    * @输出： double
     */
    public static double setScale(Double num) {
        BigDecimal b = new BigDecimal(num);
        return b.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /*
    * @函数名称：getToday
    * @函数描述：获取今天日期字符串
    * @输入： void
    * @输出： String
     */
    public static String getToday() {
        //获取当前时间
        Date date = new Date();
        int iyear = date.getYear() + 1900;
        int imonth = date.getMonth() + 1;
        int iday = date.getDate();
        String month = imonth > 9 ? String.valueOf(imonth) : ("0" + String.valueOf(imonth));
        String day = iday > 9 ? String.valueOf(iday) : ("0" + String.valueOf(iday));
//        String strDate = "2016-09-23";
        String strDate = iyear + "-" + month + "-" + day;
        return strDate;
    }

    /*
    * @函数名称：getYesterday
    * @函数描述：获取昨天日期字符串
    * @输入： void
    * @输出： String
     */
    public static String getYesterday() {
        //获取当前时间
        Date date = new Date();
        //计算1天前的日期
        Calendar c = Calendar.getInstance();
        c.setTimeInMillis(date.getTime());
        c.add(Calendar.DATE, -1);//2天前的日期
        Date last_date = new Date(c.getTimeInMillis()); //将c转换成Date
        int iyear = last_date.getYear() + 1900;
        int imonth = last_date.getMonth() + 1;
        int iday = last_date.getDate();
        String month = imonth > 9 ? String.valueOf(imonth) : ("0" + String.valueOf(imonth));
        String day = iday > 9 ? String.valueOf(iday) : ("0" + String.valueOf(iday));
//        String strDate = "2016-09-23";
        String strDate = iyear + "-" + month + "-" + day;
        return strDate;
    }

    /*
    * @函数名称：ifPushSubscribe
    * @函数描述：根据今天的日期判断是否应该推送订阅信息，因为星期六和星期天没有订单，
    * 所以星期天和星期一不应该推送订阅消息
    * @输入： void
    * @输出： boolean
     */
    public static boolean ifPushSubscribe() {
        Date date = new Date();
        //得到今天是星期几，0为星期天，1为星期一，2为星期二，3为星期三，4为星期四，
        //5为星期六，6为星期六
        int day = date.getDay();
//        System.out.println("[debug]" + day);
        //星期六和星期天不推送消息
        if (day == 0 || day == 6) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * @函数名称：getWeekOfDate
     * @函数描述：获取当前日期是星期几<br>
     *
     * @输入： int year, int month, int day
     * @输出： 当前日期是星期几
     */
    public static String getWeekOfDate(int year, int month, int day) {
        String[] weekDays = {"0000001", "1000000", "0100000", "0010000", "0001000", "0000100", "0000010"};// {"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"};
        Calendar cal = Calendar.getInstance();
        cal.set(year, month, day);
        int w = cal.get(Calendar.DAY_OF_WEEK) - 1;
        if (w < 0) {
            w = 0;
        }
        return weekDays[w];
    }

    /**
     * @函数名称：getLastDayOfMonth
     * @函数描述：获取指定月份的最后一天<br>
     *
     * @输入： int year, int month
     * @输出： 返回最后一天的数字
     */
    public static int getLastDayOfMonth(int iyear, int imonth) {
        Calendar cal = Calendar.getInstance();
        //设置年份
        cal.set(Calendar.YEAR, iyear);
        //设置月份
        cal.set(Calendar.MONTH, imonth - 1);
        //获取某月最大天数
        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
        System.out.println("[debug]last day: " + lastDay + "; month:" + imonth);
        return lastDay;
    }

    /**
     * @函数名称：getLastDaysOfYear
     * @函数描述：获取全年的每个月最后一天<br>
     *
     * @输入： void
     * @输出： 返回最后一天的字符串
     */
    public static JSONArray getLastDaysOfYear() {
        JSONArray list = new JSONArray();
        //当年时间
        Date date = new Date();
        Calendar cal = Calendar.getInstance();
        //设置年份
        int year = date.getYear() + 1900;
        cal.set(Calendar.YEAR, year);
        //设置月份
        int thismonth = cal.get(Calendar.MONTH) + 1;
        //设置月份
        for (int i = 1; i <= thismonth; i++) {
            cal.set(Calendar.MONTH, i - 1);
            //获取某月最大天数
            int day = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
            System.out.println("[debug]last day: " + day + "; month:" + i);
            String month = i > 9 ? String.valueOf(i) : ("0" + i);
            String lastDay = year + month + day;
            //将没有最后一天的字符串添加到数组中
            JSONObject obj = new JSONObject();
            obj.put("month", i);
            if (i < thismonth) {
                obj.put("lastday", lastDay);
            } else {
                obj.put("lastday", year + month + (date.getDate() - 1));
            }
            list.add(obj);
        }
        System.out.println(list.toJSONString());
        return list;
    }

    /**
     * 获取指定字符串出现的次数
     *
     * @param srcText 源字符串
     * @param findText 要查找的字符串
     * @
     */
    public static int appearNumber(String srcText, String findText) {
        int count = 0;
        int index = 0;
        while ((index = srcText.indexOf(findText, index)) != -1) {
            index = index + findText.length();
            count++;
        }
        return count;
    }

    public static int countStr(String strb, String target) {
        int count = 0;
        int index = 0;
        while (true) {
            index = strb.indexOf(target, index + 1);
            if (index > 0) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }

    /**
     * 方法名称：getSortedHashtable 参数：Hashtable h 引入被处理的散列表
     * 描述：将引入的hashtable.entrySet进行排序，并返回
     */
    public static Map.Entry[] getSortedHashtableByKey(Hashtable h) {

        Set set = h.entrySet();

        Map.Entry[] entries = (Map.Entry[]) set.toArray(new Map.Entry[set.size()]);

        Arrays.sort(entries, new Comparator() {
            public int compare(Object arg0, Object arg1) {
                Object key1 = ((Map.Entry) arg0).getKey();
                Object key2 = ((Map.Entry) arg1).getKey();
                return ((Comparable) key1).compareTo(key2);
            }

        });

        return entries;
    }

    /*
     * relax for a while, unit is second
    */
   
    
    /**
     * 获取长度为 6 的随机数字
     *
     * @return 随机数字
     *
     */
    public static String getIdentifyCode() {
        String SYMBOLS = "0123456789"; // 数字
        // 字符串
        Random RANDOM = new SecureRandom();
        // 如果需要4位，那 new char[4] 即可，其他位数同理可得
        char[] nonceChars = new char[6];
        for (int index = 0; index < nonceChars.length; ++index) {
            nonceChars[index] = SYMBOLS.charAt(RANDOM.nextInt(SYMBOLS.length()));
        }
        return new String(nonceChars);
    }
    
    /**
     * 判断元素是否在数组中
     *
     * @return boolean
     *
     */
    public static boolean isInList(List arr, String targetValue) {
        return arr.contains(targetValue);
    }
    
    /**
     * @方法描述：获取两个ArrayList的交集
     * @param firstArrayList 第一个ArrayList
     * @param secondArrayList 第二个ArrayList
     * @return resultList 交集ArrayList
     */
    public static ArrayList<String> receiveCollectionList(ArrayList<String> firstArrayList, ArrayList<String> secondArrayList) {
        int firstSize = firstArrayList.size();
        int secondSize = secondArrayList.size();
        ArrayList<String> tempList = new ArrayList();
        
        if(firstSize < secondSize){
            //交换位置
            tempList = firstArrayList;
            firstArrayList = secondArrayList;
            firstArrayList = tempList;
        }
        ArrayList<String> resultList = new ArrayList<String>();
        LinkedList<String> result = new LinkedList<String>(firstArrayList);// 大集合用linkedlist  
        HashSet<String> othHash = new HashSet<String>(secondArrayList);// 小集合用hashset  
        Iterator<String> iter = result.iterator();// 采用Iterator迭代器进行数据的操作  
        while(iter.hasNext()) {
            if(!othHash.contains(iter.next())) {  
                iter.remove();            
            }     
        }
        resultList = new ArrayList<String>(result);
        return resultList;
    }
    /**
     * @param lng
     * @方法描述：度分秒转换经纬度
     * @param firstArrayList 第一个ArrayList
     * @param secondArrayList 第二个ArrayList
     * @return resultList 交集ArrayList
     */
    public static Double tranformPos(String lng){
        String[] lntArr = lng
            .trim()
            .replace("°", ";")
            .replace("′", ";")
            .replace("'", ";")
            .replace("″", "")
            .split(";");
        Double result = 0D;
        for (int i = lntArr.length; i >0 ; i--) {
            double v = Double.parseDouble(lntArr[i-1]);
            if(i==1){
                result=v+result;
            }else{
                result=(result+v)/60;
            }
        }
        return result;
    }
    public static double stringToDouble(String a){
    	double b = Double.valueOf(a);
    	DecimalFormat df = new DecimalFormat("#.000000");//此为保留1位小数，若想保留2位小数，则填写#.00  ，以此类推
    	String temp = df.format(b);
    	b = Double.valueOf(temp);
    	return b;
    }
    public static void main(String[] arg) {
        System.out.println(tranformPos("032°37′17.219\""));
    }
}
