import { AppearBottom } from '@/components/motion/AppearBottom'
import { Title } from '@/components/ui/Title'

export default function Home() {
  return (
    <div>
      <Title>Profile</Title>
      <AppearBottom delay={0.3} className="mb-4 flex items-end gap-4">
        <p className="text-3xl font-bold">김민규</p>
        <p className="font-regular text-xl">Kim Min Gyu</p>
      </AppearBottom>
      <AppearBottom delay={0.6} className="mb-4">
        <p>
          프론트엔드 개발자 김민규입니다.
          <br /> 맥주와 리버풀을 좋아합니다.
        </p>
      </AppearBottom>
      <AppearBottom delay={0.9}>
        <p className="mb-2 font-bold">Contact</p>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <p className="font-medium">Github</p>
            <a
              href="https://github.com/cobocho"
              target="_blank"
              rel="noreferrer"
              className="font-regular"
            >
              github.com/cobocho
            </a>
          </div>
          <div className="flex gap-2">
            <p className="font-medium">E-Mail</p>
            <a href="mailto:contact@un-defined.dev" className="font-regular">
              contact@un-defined.dev
            </a>
          </div>
          <div className="flex gap-2">
            <p className="font-medium">Resume</p>
            <a
              href="https://resume.un-defined.dev"
              target="_blank"
              rel="noreferrer"
              className="font-regular"
            >
              resume.un-defined.dev
            </a>
          </div>
        </div>
      </AppearBottom>
    </div>
  )
}
