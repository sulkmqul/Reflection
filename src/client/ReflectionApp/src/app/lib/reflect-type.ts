import { reflectComponentType } from "@angular/core";


/**
 * ユーザー情報まとめ
 */
export class MsUser {

    /**
     * ユーザーID
     */
    ms_user_id: number = 0;

    /**
     * ユーザー名
     */
    user_name: string = "";

    /**
     * 管理者可否
     */
    admin_flag: number = 1;
}

/**
 * ユーザー編集情報
 */
export class MsUserEdit extends MsUser {

    login_id: string = "";
    login_password: string = "";
}

export class ListInfoColumnsType{
    public static readonly INT:string = "INTEGER";
    public static readonly REAL:string = "REAL";
    public static readonly TEXT:string = "TEXT";
}

/**
 * 一覧編集情報
 */
export class MsListInfoColumns {
    ms_list_info_columns_id: number = -1;
    display_name: string = "";
    column_type: string = "";
    notnull_flag: number = 0;
    default_value: string = "";
    sort_order: number = 0;
    visible_flag: number = 0;
}

/**
 * 汎用返答
 */
export class ReflectResponse {

    static readonly CODE_OK = 0;

    code:number = 0;
    message:string = "";
}

export class ManageListData {
    public colist: MsListInfoColumns[] = [];
    public datalist: RfListView[] = [];
}

export class RfListView { 

    public rf_list_id:number = 0;
    public filename: string = "";
    public related_rf_list_id: number = -1;
    public info:{[key:string]: any} = {};

    public update_user_name: string = ""
    public update_date: string = "";
}

export class ReflectType {
}
