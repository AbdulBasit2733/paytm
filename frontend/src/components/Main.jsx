import React from 'react'
import Header from './Header'

const Main = ({users}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <Header username={"abdul basit"} />
      <div className=" mt-10">
        <div className="flex flex-col justify-center items-start px-2">
          <div className="space-y-5 ">
            <h1 className="text-2xl font-bold">
              Account Balance : <span className="font-medium">40000</span>
            </h1>
            <button className="px-5 py-2 rounded-md font-semibold bg-slate-950 text-white">
              Add Balance
            </button>
          </div>
          <div className="bg-slate-100 py-10 mt-5 w-full px-4">
            <h1 className="text-2xl font-bold">Users</h1>
            {users && users.length === 0 ? (
              <div>No User Found</div>
            ) : (
              <div className="mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 place-items-center place-content-center">
                  <div className="flex flex-1 justify-between gap-x-40 col-span-2 items-center">
                    <h1>Id</h1>
                    <h1>Name</h1>
                    <h1>Username</h1>
                    <h1>Email</h1>
                  </div>
                  <button className="text-sm font-bold py-3 px-5 bg-slate-900 text-white rounded-md">
                    Send Money
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main