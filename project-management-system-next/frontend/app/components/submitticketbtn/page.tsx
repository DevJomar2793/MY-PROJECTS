"use client";

import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";

export type TicketForm = {
  ticket_number: string;
  subject_name: string;
  reported_by: string;
  emails: string;
  server: string;
  type: string;
  priority: string;
  module: string;
  screen_number: string;
  details: string;
  changed: string;
};

export default function SubmitTicketBtn() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [emails, setEmails] = useState("");
  const [server, setServer] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [module, setModule] = useState("");
  const [screenNumber, setScreenNumber] = useState("");
  const [details, setDetails] = useState("");
  const [changed, setChanged] = useState("");

  const handleSubmitTicket = () => {
    setIsModalOpen(false);
    const formData = {
      ticket_number: ticketNumber,
      subject_name: subjectName,
      reported_by: reportedBy,
      emails: emails,
      server: server,
      type: type,
      priority: priority,
      module: module,
      screen_number: screenNumber,
      details: details,
      changed: changed,
    };

    console.log("Form Data: ", formData);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20 rounded-lg px-4 py-2.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer"
      >
        <PlusIcon className="w-5 h-5" />
        Submit Ticket
      </button>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
          isModalOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsModalOpen(false)}
      >
        <div
          className={`bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] transform transition-all duration-300 overflow-hidden ${
            isModalOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
            <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <PlusIcon className="w-5 h-5 text-blue-600" />
              Submit Ticket
            </h3>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-1.5 rounded-full transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
            <div className="flex flex-col">
              <label
                htmlFor="ticket_number"
                className="text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300"
              >
                Ticket Number
              </label>
              <input
                type="text"
                id="ticket_number"
                placeholder="e.g. TICK-1024"
                className="border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900/50 w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="subject_name"
                className="text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300"
              >
                Subject Name
              </label>
              <input
                type="text"
                id="subject_name"
                placeholder="Brief description of the issue"
                className="border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900/50 w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="reported_by"
                className="text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300"
              >
                Reported By
              </label>
              <input
                type="text"
                id="reported_by"
                placeholder="Name of reporter"
                className="border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900/50 w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="emails"
                className="text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300"
              >
                Emails
              </label>
              <input
                type="text"
                id="emails"
                placeholder="user@example.com"
                className="border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900/50 w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="server"
                className="text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300"
              >
                Server
              </label>
              <input
                type="text"
                id="server"
                placeholder="Server name or IP"
                className="border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900/50 w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm"
                value={server}
                onChange={(e) => setServer(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="type"
                className="text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300"
              >
                Type
              </label>
              <input
                type="text"
                id="type"
                placeholder="e.g. Bug, Feature Request"
                className="border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900/50 w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="priority"
                className="text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300"
              >
                Priority
              </label>
              <input
                type="text"
                id="priority"
                placeholder="Low, Medium, High"
                className="border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900/50 w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="module"
                className="text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300"
              >
                Module
              </label>
              <input
                type="text"
                id="module"
                placeholder="Affected module"
                className="border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900/50 w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm"
                value={module}
                onChange={(e) => setModule(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label
                htmlFor="screen_number"
                className="text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300"
              >
                Screen Number
              </label>
              <input
                type="text"
                id="screen_number"
                placeholder="Screen reference"
                className="border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900/50 w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm"
                value={screenNumber}
                onChange={(e) => setScreenNumber(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label
                htmlFor="details"
                className="text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300"
              >
                Details
              </label>
              <textarea
                id="details"
                rows={3}
                placeholder="Please provide detailed information about the issue..."
                className="border border-slate-300 dark:border-slate-700 rounded-lg p-6 bg-slate-50 dark:bg-slate-900/50 w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm resize-y"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label
                htmlFor="changed"
                className="text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300"
              >
                Changed
              </label>
              <textarea
                id="changed"
                rows={2}
                placeholder="Any recent changes that might have caused this?"
                className="border border-slate-300 dark:border-slate-700 rounded-lg p-6 bg-slate-50 dark:bg-slate-900/50 w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm resize-y"
                value={changed}
                onChange={(e) => setChanged(e.target.value)}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitTicket}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 transition-all shadow-sm flex items-center gap-2"
            >
              Submit Ticket
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
