from sqlmodel import Field,SQLModel, Column, String
from datetime import datetime
from pydantic import BaseModel

ZID_REGEX_PATTERN = "^z\d{5}$"
ZID_FIELD = Field(regex= ZID_REGEX_PATTERN, description="ZID must be 'z' followed by 5 digits",
                   sa_column= Column(String,unique= True), schema_extra= {'pattern': ZID_REGEX_PATTERN})

class MemberBase(SQLModel):
    name : str
    zid : str = ZID_FIELD


class Member(MemberBase,table = True):
    id : int | None = Field(default= None, primary_key= True)
    password : str


class MemberCreate(MemberBase):
    password : str

class MemberUpdate(MemberBase):
    name : str | None
    zid  : str = ZID_FIELD
    password : str | None

class MemberPublic(MemberBase):
    id : int


class AuthenticationTable(SQLModel, table = True):
    id : int| None = Field(default= None,primary_key= True)
    member_id : int = Field(foreign_key= "member.id")
    cookie : str
    expires_at : datetime


class LoginRequest(BaseModel):
    zid: str = ZID_FIELD
    password: str




