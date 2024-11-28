function isInteger(str: string): boolean {
    const parsed = parseInt(str, 10);
    return !isNaN(parsed) && parsed.toString() === str;
  }

export const checkZid = (zid : string) : boolean => {

    if (zid.length != 6){
        return false
    }

    if(zid[0] !== "z"){
        return false
    }

    return isInteger(zid.slice(1,zid.length))
}