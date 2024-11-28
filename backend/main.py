from fastapi.middleware.cors import CORSMiddleware
import PIL.Image as Image
from predictor import predict as predictImage
from fastapi import FastAPI, Request,HTTPException, status,Query,Path,Depends, Response, Cookie
from contextlib import asynccontextmanager
from models.models import Member, MemberBase, MemberCreate, MemberPublic,MemberUpdate, ZID_REGEX_PATTERN, AuthenticationTable, LoginRequest
# very important that I import this after models are imported
from models.db import engine,createDatabaseAndTables
from sqlmodel import Session, select
from typing import Annotated, List
import secrets
import datetime
from fastapi.staticfiles import StaticFiles


@asynccontextmanager
async def lifespan(app : FastAPI):
    print("creating database and tables")
    createDatabaseAndTables()
    yield
    print("After closing the app")

def get_session():
    with Session(engine) as session:
        yield session



# Creating session dependency
SessionDep = Annotated[Session, Depends(get_session)]


def get_member(session : SessionDep, auth_cookie :str =  Cookie(None)):
    if not auth_cookie:
        raise HTTPException(status_code=401, detail="Authentication cookie not provided")
    auth_table_entry = session.exec(select(AuthenticationTable).where(AuthenticationTable.cookie == auth_cookie)).first()
    time_now = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
    if not auth_table_entry:
        raise HTTPException(status_code=401, detail="Cookie not present")
    
    if  time_now > auth_table_entry.expires_at:
        session.delete(auth_table_entry)
        session.commit()
        raise HTTPException(status_code=401, detail="Cookie expired, login again")
    
    member = session.exec(select(Member).where(Member.id == auth_table_entry.member_id)).one()
    return member
          


# Creating App
app = FastAPI(lifespan= lifespan)


# CORS settings
origins = ["http://localhost:3000"]
app.add_middleware(CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
                   )






@app.post(path= "/api/add_member", response_model= MemberPublic)
async def addMember(member : MemberCreate, session : SessionDep, current_member: Member = Depends(get_member)):
    existing_member = session.exec(select(Member).where(Member.zid == member.zid)).first()

    if existing_member:
        raise HTTPException(
            status_code= status.HTTP_400_BAD_REQUEST,
            detail= "Member with zid {} already exists".format(member.zid) 
        )

    db_member = Member.model_validate(member)
    session.add(db_member)
    session.commit()
    session.refresh(db_member)
    return db_member


@app.get(path= "/api/{zid}", response_model= MemberPublic)
async def getMember(zid : Annotated[str, Path(pattern= ZID_REGEX_PATTERN)], session : SessionDep,current_member: Member = Depends(get_member)):
    response = session.exec(select(Member).where(Member.zid == zid)).first()
    if response is None:
        raise HTTPException(
            status_code= status.HTTP_400_BAD_REQUEST,
            detail= "Member with zid {} does not exists in the database".format(zid)
        )
    return response


@app.put(path= "/api/{id}", response_model= MemberPublic)
async def updateMember(id : int, update_member : MemberUpdate, session : SessionDep,current_member: Member = Depends(get_member)):
    db_member = session.exec(select(Member).where(Member.id == id)).one()
    if not db_member:
            raise HTTPException(
            status_code= status.HTTP_400_BAD_REQUEST,
            detail= "Member with id {} does not exists in the database".format(id)
        )
    update_data = update_member.model_dump(exclude_unset=True)
    db_member.sqlmodel_update(update_data)
    session.add(db_member)
    session.commit()
    session.refresh(db_member)
    return db_member


@app.get(path= "/api/delete/{id}")
async def deleteMember(id : int, session : SessionDep,current_member: Member = Depends(get_member)):
    db_member = session.exec(select(Member).where(Member.id == id)).one()
    if not db_member:
            raise HTTPException(
            status_code= status.HTTP_400_BAD_REQUEST,
            detail= "Member with id {} does not exists in the database".format(id)
        )
    session.delete(db_member)
    session.commit()
    return {str(id) : "deleated"}



@app.get(path= "/api/all/" , response_model= List[MemberPublic])
async def getMembers(session : SessionDep,current_member: Member = Depends(get_member),
                     offset : Annotated[int, Query] = 0, limit : Annotated[int, Query(ge= 1)] = 1):
    res =  session.exec(select(Member).limit(limit).offset(offset).order_by(Member.id)).all()
    print(res)
    return res




@app.post(path= "/api/auth/login")
async def login(session : SessionDep,login_data : LoginRequest,response: Response):
    db_member = session.exec(select(Member).where(Member.zid == login_data.zid)).first()
    if not db_member:
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail= "Wrong ZID !!!")

    if login_data.password != "beerbeerbeer":
        raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED, detail= "Wrong password boi")
    
    cookie = secrets.token_urlsafe(32)
    expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)  # Example: 1 hour expiration
    auth_entry = AuthenticationTable(
         member_id= db_member.id,
         cookie= cookie,
         expires_at= expires_at
    )

    session.add(auth_entry)
    session.commit()
    session.refresh(auth_entry)

    response.set_cookie(key= "auth_cookie", value= cookie, httponly=True, expires= 3600)
    return {"login" : "success"}


@app.get(path= "/api/auth/logout", response_model= MemberPublic)
async def logout(session : SessionDep,response : Response, current_member : Member = Depends(get_member)):
    auth_entries = session.exec(select(AuthenticationTable).where(AuthenticationTable.member_id == current_member.id)).all()
    for auth_entry in auth_entries:
        session.delete(auth_entry)
    session.commit()
    response.delete_cookie(key= "auth_cookie")
    return current_member


    
@app.get(path= "/api/auth/is_logged_in", response_model= MemberPublic)
async def getCurrentMember(current_member: Member = Depends(get_member)):
    return current_member    
    
    





app.mount("/", StaticFiles(directory="out", html=True), name="static")











