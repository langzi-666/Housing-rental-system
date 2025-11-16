import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const BASE_URL = 'http://localhost:5175'
const OUTPUT_DIR = path.join(__dirname, 'docs')
const SCREENSHOT_OPTIONS = {
  fullPage: true,
  type: 'png'
  // PNG 格式不支持 quality 参数，只有 JPEG 格式才支持
}

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// 需要截图的页面列表
const pages = [
  { path: '/', name: '首页' },
  { path: '/login', name: '登录页' },
  { path: '/register', name: '注册页' }
]

// 需要登录后才能访问的页面（可选）
const authenticatedPages = [
  { path: '/create', name: '创建帖子' },
  { path: '/profile', name: '个人资料' },
  { path: '/favorites', name: '我的收藏' },
  { path: '/merchant/register', name: '商家注册' },
  { path: '/merchant/manage', name: '商家管理' }
]

// 管理员页面（需要管理员权限）
const adminPages = [
  { path: '/admin/dashboard', name: '管理员-仪表盘' },
  { path: '/admin/users', name: '管理员-用户管理' },
  { path: '/admin/posts', name: '管理员-帖子审核' },
  { path: '/admin/configs', name: '管理员-系统配置' },
  { path: '/admin/logs', name: '管理员-系统日志' }
]

/**
 * 等待页面加载完成
 */
async function waitForPageLoad(page) {
  // 等待页面基本元素加载
  await page.waitForSelector('body', { timeout: 10000 })
  
  // 等待Vue应用加载
  await page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 10000 }
  )
  
  // 额外等待一下，确保动态内容加载
  await page.waitForTimeout(2000)
}

/**
 * 截图单个页面
 */
async function screenshotPage(browser, url, filename, description) {
  try {
    console.log(`正在截图: ${description} (${url})`)
    const page = await browser.newPage()
    
    // 设置视口大小
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    })
    
    // 访问页面
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    })
    
    // 等待页面加载
    await waitForPageLoad(page)
    
    // 截图
    const filepath = path.join(OUTPUT_DIR, filename)
    await page.screenshot({
      path: filepath,
      ...SCREENSHOT_OPTIONS
    })
    
    console.log(`✓ 已保存: ${filename}`)
    await page.close()
    
    return { success: true, filename, description }
  } catch (error) {
    console.error(`✗ 截图失败 ${description}:`, error.message)
    return { success: false, filename, description, error: error.message }
  }
}

/**
 * 登录（如果需要）
 */
async function login(page, username, password) {
  try {
    await page.goto(`${BASE_URL}/login`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    })
    
    await waitForPageLoad(page)
    
    // 等待表单加载
    await page.waitForSelector('.el-input__inner', { timeout: 5000 })
    
    // 填写用户名 - Element Plus 输入框
    const usernameInputs = await page.$$('.el-input__inner')
    if (usernameInputs.length > 0) {
      await usernameInputs[0].click({ clickCount: 3 }) // 选中所有文本
      await usernameInputs[0].type(username)
    }
    
    // 填写密码
    const passwordInputs = await page.$$('input[type="password"]')
    if (passwordInputs.length > 0) {
      await passwordInputs[0].click({ clickCount: 3 })
      await passwordInputs[0].type(password)
    }
    
    // 点击登录按钮
    await page.waitForTimeout(500) // 等待输入完成
    const loginButton = await page.$('.el-button--primary')
    if (loginButton) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {}),
        loginButton.click()
      ])
    }
    
    // 等待登录完成和页面跳转
    await page.waitForTimeout(3000)
    
    // 检查是否登录成功（检查是否有token或跳转到首页）
    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      // 如果还在登录页，可能登录失败
      throw new Error('登录后仍在登录页面，可能登录失败')
    }
    
    console.log('✓ 登录成功')
    return true
  } catch (error) {
    console.error('✗ 登录失败:', error.message)
    return false
  }
}

/**
 * 检测系统 Chrome 路径
 */
function findSystemChrome() {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe'
  ]
  
  for (const chromePath of possiblePaths) {
    if (chromePath && fs.existsSync(chromePath)) {
      return chromePath
    }
  }
  return null
}

/**
 * 主函数
 */
async function main() {
  console.log('开始截图任务...')
  console.log(`前端地址: ${BASE_URL}`)
  console.log(`输出目录: ${OUTPUT_DIR}\n`)
  
  // 检测浏览器路径
  const systemChrome = findSystemChrome()
  const launchOptions = {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
  
  if (systemChrome) {
    console.log(`使用系统 Chrome: ${systemChrome}\n`)
    launchOptions.executablePath = systemChrome
  } else {
    console.log('使用 Puppeteer 自带的 Chrome\n')
  }
  
  // 启动浏览器（使用新的 headless 模式）
  const browser = await puppeteer.launch(launchOptions)
  
  const results = []
  
  try {
    // 检查前端服务是否运行（通过访问首页）
    console.log('检查前端服务...')
    const testPage = await browser.newPage()
    try {
      await testPage.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 10000 })
      console.log('✓ 前端服务运行正常\n')
      await testPage.close()
    } catch (error) {
      await testPage.close()
      await browser.close()
      console.error(`✗ 前端服务未运行: ${error.message}`)
      console.log('\n提示: 请确保前端服务正在运行:')
      console.log('  cd food-sharing-frontend')
      console.log('  npm run dev')
      process.exit(1)
    }
    
    // 1. 截图公开页面
    console.log('=== 截图公开页面 ===')
    for (const page of pages) {
      const url = `${BASE_URL}${page.path}`
      const filename = `${page.name.replace(/\s+/g, '_')}.png`
      const result = await screenshotPage(browser, url, filename, page.name)
      results.push(result)
    }
    
    // 2. 截图需要登录的页面（可选）
    console.log('\n=== 截图需要登录的页面 ===')
    console.log('提示: 这些页面需要登录，如果登录失败将跳过')
    
    // 尝试登录（使用环境变量或默认值）
    const username = process.env.SCREENSHOT_USERNAME || 'admin'
    const password = process.env.SCREENSHOT_PASSWORD || 'admin123'
    
    const loginPage = await browser.newPage()
    const loginSuccess = await login(loginPage, username, password)
    await loginPage.close()
    
    if (loginSuccess) {
      for (const page of authenticatedPages) {
        const url = `${BASE_URL}${page.path}`
        const filename = `${page.name.replace(/\s+/g, '_')}.png`
        const result = await screenshotPage(browser, url, filename, page.name)
        results.push(result)
      }
      
      // 3. 截图管理员页面
      console.log('\n=== 截图管理员页面 ===')
      for (const page of adminPages) {
        const url = `${BASE_URL}${page.path}`
        const filename = `${page.name.replace(/\s+/g, '_')}.png`
        const result = await screenshotPage(browser, url, filename, page.name)
        results.push(result)
      }
    } else {
      console.log('跳过需要登录的页面（登录失败）')
    }
    
    // 生成截图报告
    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length
    
    console.log('\n=== 截图完成 ===')
    console.log(`成功: ${successCount} 个`)
    console.log(`失败: ${failCount} 个`)
    console.log(`输出目录: ${OUTPUT_DIR}`)
    
    if (failCount > 0) {
      console.log('\n失败的页面:')
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.description}: ${r.error}`)
      })
    }
    
  } finally {
    await browser.close()
  }
}

// 运行主函数
main().catch(error => {
  console.error('发生错误:', error)
  process.exit(1)
})

