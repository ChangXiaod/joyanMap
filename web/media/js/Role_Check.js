/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function f_zfjd() {
    //check the parent's status
    if (document.getElementById("zfjd").checked == true) {
        document.getElementById("rcjd").checked = true;
        document.getElementById("sjcc").checked = true;
        document.getElementById("ccjl").checked = true;
    } else {
        document.getElementById("rcjd").checked = false;
        document.getElementById("sjcc").checked = false;
        document.getElementById("ccjl").checked = false;
    }

}

function cf_zfjd() {
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("rcjd").checked == true ||
            document.getElementById("sjcc").checked == true ||
            document.getElementById("ccjl").checked == true) {
        document.getElementById("zfjd").checked = true;
    }
    if (document.getElementById("rcjd").checked == false &&
            document.getElementById("sjcc").checked == false &&
            document.getElementById("ccjl").checked == false) {
        document.getElementById("zfjd").checked = false;
    }
}

function f_ywjd() {
    //check the parent's status
    if (document.getElementById("ywjd").checked == true) {
        document.getElementById("lmzq").checked = true;
        document.getElementById("sgcl").checked = true;
        document.getElementById("clgl").checked = true;
        document.getElementById("zxgl").checked = true;
    } else {
        document.getElementById("lmzq").checked = false;
        document.getElementById("sgcl").checked = false;
        document.getElementById("clgl").checked = false;
        document.getElementById("zxgl").checked = false;
    }

}

function cf_ywjd() {
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("lmzq").checked == true ||
            document.getElementById("sgcl").checked == true ||
            document.getElementById("clgl").checked == true ||
            document.getElementById("zxgl").checked == true) {
        document.getElementById("ywjd").checked = true;
    }
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("lmzq").checked == false &&
            document.getElementById("sgcl").checked == false &&
            document.getElementById("clgl").checked == false &&
            document.getElementById("zxgl").checked == false) {
        document.getElementById("ywjd").checked = false;
    }
}

function f_syjd() {
    //check the parent's status
    if (document.getElementById("syjd").checked == true) {
        document.getElementById("syjd1").checked = true;
        document.getElementById("syyc").checked = true;
    } else {
        document.getElementById("syjd1").checked = false;
        document.getElementById("syyc").checked = false;
    }

}

function cf_syjd() {
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("syjd1").checked == true ||
            document.getElementById("syyc").checked == true) {
        document.getElementById("syjd").checked = true;
    }
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("syjd1").checked == false &&
            document.getElementById("syyc").checked == false) {
        document.getElementById("syjd").checked = false;
    }
}

function f_zfcc() {
    //check the parent's status
    if (document.getElementById("zfcc").checked == true) {
        document.getElementById("zfcc1").checked = true;
    } else {
        document.getElementById("zfcc1").checked = false;
    }

}

function cf_zfcc() {
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("zfcc1").checked == true) {
        document.getElementById("zfcc").checked = true;
    }
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("zfcc1").checked == false) {
        document.getElementById("zfcc").checked = false;
    }
}

function f_jdkp() {
    //check the parent's status
    if (document.getElementById("jdkp").checked == true) {
        document.getElementById("jdkp1").checked = true;
        document.getElementById("slkp").checked = true;
    } else {
        document.getElementById("jdkp1").checked = false;
        document.getElementById("slkp").checked = false;
    }

}

function cf_jdkp() {
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("jdkp1").checked == true ||
            document.getElementById("slkp").checked == true) {
        document.getElementById("jdkp").checked = true;
    }
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("jdkp1").checked == false &&
            document.getElementById("slkp").checked == false) {
        document.getElementById("jdkp").checked = false;
    }
}

function f_xxbz() {
    //check the parent's status
    if (document.getElementById("xxbz").checked == true) {
        document.getElementById("xxbz1").checked = true;
    } else {
        document.getElementById("xxbz1").checked = false;
    }

}

function cf_xxbz() {
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("xxbz1").checked == true) {
        document.getElementById("xxbz").checked = true;
    }
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("xxbz1").checked == false) {
        document.getElementById("xxbz").checked = false;
    }
}

function f_tjfx() {
    //check the parent's status
    if (document.getElementById("tjfx").checked == true) {
        document.getElementById("tjxx").checked = true;
        document.getElementById("qst").checked = true;
        document.getElementById("qsdbt").checked = true;
        document.getElementById("sjbb").checked = true;
    } else {
        document.getElementById("tjxx").checked = false;
        document.getElementById("qst").checked = false;
        document.getElementById("qsdbt").checked = false;
        document.getElementById("sjbb").checked = false;
    }

}

function cf_tjfx() {
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("tjxx").checked == true ||
            document.getElementById("qst").checked == true ||
            document.getElementById("qsdbt").checked == true ||
            document.getElementById("sjbb").checked == true) {
        document.getElementById("tjfx").checked = true;
    }
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("tjxx").checked == false &&
            document.getElementById("qst").checked == false &&
            document.getElementById("qsdbt").checked == false &&
            document.getElementById("sjbb").checked == false) {
        document.getElementById("tjfx").checked = false;
    }
}

function f_aqsj() {
    //check the parent's status
    if (document.getElementById("aqsj").checked == true) {
        document.getElementById("glxtrz").checked = true;
        document.getElementById("sjcj").checked = true;
        document.getElementById("zfjlrz").checked = true;
    } else {
        document.getElementById("glxtrz").checked = false;
        document.getElementById("sjcj").checked = false;
        document.getElementById("zfjlrz").checked = false;
    }

}

function cf_aqsj() {
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("glxtrz").checked == true ||
            document.getElementById("sjcj").checked == true ||
            document.getElementById("zfjlrz").checked == true) {
        document.getElementById("aqsj").checked = true;
    }
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("glxtrz").checked == false &&
            document.getElementById("sjcj").checked == false &&
            document.getElementById("zfjlrz").checked == false) {
        document.getElementById("aqsj").checked = false;
    }
}

function f_sbgl() {
    //check the parent's status
    if (document.getElementById("sbgl").checked == true) {
        document.getElementById("zfjlgl").checked = true;
        document.getElementById("ggjl").checked = true;
    } else {
        document.getElementById("zfjlgl").checked = false;
        document.getElementById("ggjl").checked = false;
    }

}

function cf_sbgl() {
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("zfjlgl").checked == true ||
            document.getElementById("ggjl").checked == true) {
        document.getElementById("sbgl").checked = true;
    }
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("zfjlgl").checked == false &&
            document.getElementById("ggjl").checked == false) {
        document.getElementById("sbgl").checked = false;
    }
}

function f_xtgl() {
    //check the parent's status
    if (document.getElementById("xtgl").checked == true) {
        document.getElementById("bmgl").checked = true;
        document.getElementById("yhgl").checked = true;
        document.getElementById("jsgl").checked = true;
        document.getElementById("kqgl").checked = true;
    } else {
        document.getElementById("bmgl").checked = false;
        document.getElementById("yhgl").checked = false;
        document.getElementById("jsgl").checked = false;
        document.getElementById("kqgl").checked = false;
    }

}

function cf_xtgl() {
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("bmgl").checked == true ||
            document.getElementById("yhgl").checked == true ||
            document.getElementById("jsgl").checked == true ||
            document.getElementById("kqgl").checked == true) {
        document.getElementById("xtgl").checked = true;
    }
    //if one of childs' selected, the parent will be selected
    if (document.getElementById("bmgl").checked == false &&
            document.getElementById("yhgl").checked == false &&
            document.getElementById("jsgl").checked == false &&
            document.getElementById("kqgl").checked == false) {
        document.getElementById("xtgl").checked = false;
    }
}

function f_spcjz() {
    if (document.getElementById("spcjz").checked == true) {
        document.getElementById("spcjz1").checked = true;
    } else {
        document.getElementById("spcjz1").checked = false;
    }
}

function cf_spcjz() {
    if (document.getElementById("spcjz1").checked == true) {
        document.getElementById("spcjz").checked = true;
    }
    if (document.getElementById("spcjz1").checked == false) {
        document.getElementById("spcjz").checked = false;
    }
}


