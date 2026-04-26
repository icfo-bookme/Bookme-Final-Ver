module.exports = {
  apps: [
    {
      name: "bookme",
      script: "node_modules/.bin/next",
      args: "start -p 3001",

      cwd: "/var/www/bookme",

      instances: 1,
      exec_mode: "fork",

      autorestart: true,
      watch: false,
      max_memory_restart: "500M",

      env: {
        NODE_ENV: "production",
        PORT: 3001
      },

      error_file: "/var/log/pm2/bookme-error.log",
      out_file: "/var/log/pm2/bookme-out.log",
      log_file: "/var/log/pm2/bookme-combined.log",
      time: true,

      exp_backoff_restart_delay: 100,

      merge_logs: true
    }
  ]
};