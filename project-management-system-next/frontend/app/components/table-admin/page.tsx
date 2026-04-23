"use client";

import SubmitTicketButton from "../submitticketbtn/page";

// import { useState } from "react";

export default function TableAdmin() {
  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-80 bg-slate-800 text-white rounded-xl"
            />
          </div>
          <SubmitTicketButton />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-3 px-4">Ticket #</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Created</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="py-3 px-4 font-medium">1231231231</td>
                <td className="py-3 px-4">BUG</td>
                <td className="py-3 px-4">Sales Report Discrepancy</td>
                <td className="py-3 px-4">Critical</td>
                <td className="py-3 px-4">In Progress</td>
                <td className="py-3 px-4">Alexes Arcena</td>
                <td className="py-3 px-4">3 Months Ago</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="py-3 px-4 font-medium">1231231231</td>
                <td className="py-3 px-4">REQUEST</td>
                <td className="py-3 px-4">Mobile Worker App Syncing Issue</td>
                <td className="py-3 px-4">ASAP</td>
                <td className="py-3 px-4">For Observation</td>
                <td className="py-3 px-4">Joanna Marie Tulfo</td>
                <td className="py-3 px-4">3 Months Ago</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="py-3 px-4 font-medium">1231231231</td>
                <td className="py-3 px-4">BUG </td>
                <td className="py-3 px-4">
                  LOT Sales Report AB 34G Loading Issue
                </td>
                <td className="py-3 px-4">ASAP</td>
                <td className="py-3 px-4">Pending</td>
                <td className="py-3 px-4">Jonard Manaloto</td>
                <td className="py-3 px-4">3 Months Ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
