const fs = require('fs');

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
                const spinner = ora('正在下载模板...');
                spinner.start();
				download('antgod/any-cli', name, {clone: false}, (err) => {
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
							console.log(result);
                            fs.writeFileSync(fileName, result);
                        }else{
							console.log(symbols.error, chalk.green('改写package 不存在'));
						}
                        console.log(symbols.success, chalk.green('项目初始化完成1111111111111111111'));
                    }
                })
            })
        }else{
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red('项目已存在'));
        }
}