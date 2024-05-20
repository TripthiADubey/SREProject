export type Job = {
    cmd: string;
    fun: string;
    fun_args: Array<string>;
    id: string;
    jid: string;
    retcode: number;
    return: string | boolean;
    success: boolean;
    _stamp: Date;
}