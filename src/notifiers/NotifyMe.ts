const { execSync } = require("child_process");

export class NotifyMe {
  notify(title: string, content: string) {
    title = title.replace(/"/g, "\"")
    content = content.replace(/"/g, "\"")
    const cmd = `notify_me -title "${title}" -content "${content}"`
    // TODO: Might want to keep the logging but use the NestJS logger.
    console.log(cmd)

    const stdout = execSync(cmd)
    console.log(stdout.toString())
  }
}
