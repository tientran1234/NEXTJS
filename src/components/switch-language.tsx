'use client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Locale, locales } from "@/config"
import { usePathname, useRouter } from "@/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Suspense } from "react"

export default function SwitchLanguage(){
    return (
        <Suspense>
            <SwitchLanguageMain/>
        </Suspense>
    )
}

  export function SwitchLanguageMain() {
const t = useTranslations('SwitchLanguage')
const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
    
    return (
      <Select value={locale} onValueChange={value=>{
      //   const locales= params.locale as Locale
      //  const newPathname =pathname.replace(`/${locales}`,`/${value}`)
      //  console.log(newPathname);
       
        // const fullUrl= `${newPathname}?${searchParams.toString()}`
        // console.log(fullUrl);
        
    router.replace(pathname ,{
      locale:value as Locale
    })
    router.refresh()
      }}>
        <SelectTrigger className="w-[170px]">
          <SelectValue placeholder={t('title')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {locales.map((locale)=>(
                 <SelectItem value={locale} key={locale}>{t(locale)}</SelectItem>
            ))}
           
            
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }