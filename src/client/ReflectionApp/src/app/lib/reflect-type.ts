import { reflectComponentType } from "@angular/core";


/**
 * ユーザー情報まとめ
 */
export class UserInfo {

    /**
     * ユーザーID
     */
    UserID:number = 0;

    /**
     * ユーザー名
     */
    UserName:string = "";

    /**
     * 管理者可否
     */
    AdminFlag:boolean =false;

}

/**
 * 一覧編集情報
 */
export class MsListInfoColumns {
    ms_list_info_columns_id: number = -1;
    column_name: string = "";
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

export class ReflectType {
}
