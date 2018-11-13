const fs = require('fs');
const path = require('path')
const util = require('util')
const child_process = require('child_process')
const spawn = util.promisify(child_process.spawn)
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');


module.exports = (name)=>{
	if(!fs.existsSync(name)){
            inquirer.prompt([
                {
					type:'input',
					name: 'description',
					message: '请输入项目描述'
				},
				{
					type:'input',
					name: 'author',
					message: '请输入作者名称'
				}
            ]).then((answers) => {
                const spinner = ora({text:'正在下载模板...',color:'green'});
                spinner.start();
				download('sunjp123/share', name, {clone: false}, async (err) => {
                    if(err){
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err));
                    }else{
                        spinner.succeed();
                        const fileName = `${name}/package.json`;
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author
                        }
                        if(fs.existsSync(fileName)){
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result);
                        }else{
							console.log(symbols.error, chalk.red('改写package 不存在'));
                        }
                        const spinnerNpm = ora({text:'正在初始化依赖...',color:'green'});
                        spinnerNpm.start();
                        spawn('npm.cmd',['install'],{cwd:name},async (err,stdout,stderr)=>{
                            if(err){
                                spinnerNpm.fail();
                                console.log(symbols.error, chalk.red(err));
                            }
                            console.log(symbols.success, chalk.green('初始化依赖完成'));
                            spinnerNpm.succeed();
                            console.log(symbols.success, chalk.green('项目初始化完成')); 
                        })
                        		
						                       
                    }
                })
            })
        }else{
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red('项目已存在'));
        }
}