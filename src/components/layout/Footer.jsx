const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M12 .5C5.7.5.6 5.6.6 11.9c0 5 3.3 9.3 7.9 10.8.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1.7 2.7 1.4 3.1 1.1.8 2.3.6 2.9.4.1-.8.4-1.4.8-1.7-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.8C23.4 5.6 18.3.5 12 .5Z" />
  </svg>
);

const ThreadsIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M17.6 11.2c-.3-.1-.6-.2-.9-.3-.1-1.5-.6-2.7-1.5-3.5-.8-.8-1.9-1.2-3.3-1.2-2.3 0-4 1.3-4.5 3.5l1.8.5c.4-1.5 1.3-2.2 2.7-2.2 1.7 0 2.7 1 2.9 2.7-.8-.1-1.7-.1-2.6 0-2.5.2-4 1.4-4 3.2 0 1 .5 1.9 1.4 2.5.8.6 1.9.8 3.1.7 1.6-.1 2.9-.8 3.5-2 .4-.7.6-1.5.6-2.5.1 0 .2.1.3.1 1.3.6 2 1.6 1.9 3-.1 1.5-.9 2.8-2.3 3.7-1.2.8-2.8 1.2-4.6 1.2-2.1 0-3.9-.7-5.2-2-1.3-1.4-2-3.3-2-5.6s.7-4.2 2-5.6c1.3-1.3 3.1-2 5.2-2s3.9.7 5.2 2c.6.6 1.1 1.4 1.4 2.3l1.8-.5c-.4-1.2-1-2.2-1.9-3.1C16.9 4.5 14.7 3.7 12 3.7s-4.9.8-6.5 2.5C3.9 7.9 3.1 10.2 3.1 13s.8 5.1 2.4 6.8c1.6 1.7 3.8 2.5 6.5 2.5 2.2 0 4.1-.5 5.6-1.5 1.9-1.3 3-3.1 3.1-5.1.1-2.1-1-3.7-3.1-4.5Zm-3.1 3.1c-.3.6-.9.9-1.9 1-1.4.1-2.3-.5-2.4-1.4 0-.7.8-1.2 2.1-1.3.3 0 .7-.1 1-.1.5 0 1 0 1.4.1 0 .7-.1 1.3-.2 1.7Z" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-slate-600">
          &copy; Web Tính Điểm ĐHQG-HCM 2026
        </p>
        <p className="mt-1 text-center text-sm text-slate-500">
          Công cụ tham khảo, không phải thông tin chính thức từ ĐHQG-HCM.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm">
          <a
            href="https://github.com/trhming/vnuhcm-calculator"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-slate-600 transition-colors hover:text-sky-700 hover:underline"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
          <span className="text-slate-300">|</span>
          <a
            href="https://www.threads.com/@trhming_"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-slate-600 transition-colors hover:text-sky-700 hover:underline"
          >
            <ThreadsIcon className="h-4 w-4" />
            Threads
          </a>
        </div>
      </div>
    </footer>
  );
};
