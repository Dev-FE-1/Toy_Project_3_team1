import React from 'react'
import styled from '@emotion/styled'
import { useForm } from 'react-hook-form'
import Input from '@/components/common/Input/Input'
import Button from '@/components/common/Button/Button'
import { colors } from '@/constants/color'
import { useNavigate } from 'react-router-dom'
import { app } from '@/firebase/firebaseConfig'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import ButtonLink from '@/components/common/Button/ButtonLink'
import { PATH } from '@/constants/path'
import { fontSize, fontWeight } from '@/constants/font'
import logo from '@/assets/myidoru_logo.svg'

interface FormInputs {
  email: string
  password: string
  confirmPassword?: string
}

interface FormProps {
  title: string
  onSubmit: (data: FormInputs) => void
  firebaseError?: string
  includeConfirmPassword?: boolean
}

const Form: React.FC<FormProps> = ({
  title,
  onSubmit,
  firebaseError,
  includeConfirmPassword = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputs>({
    mode: 'onChange',
  })

  const password = watch('password')

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        value={watch('email') || ''}
        placeholder="이메일을 입력해주세요."
        {...register('email', {
          required: '이메일을 입력해주세요.',
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: '이메일 형식이 올바르지 않습니다.',
          },
        })}
      />
      {errors.email && <span className="error-notice">{errors.email.message}</span>}

      <Input
        type="password"
        value={watch('password') || ''}
        placeholder="비밀번호를 입력해주세요."
        {...register('password', {
          required: '비밀번호를 입력해주세요.',
          minLength: {
            value: 6,
            message: '비밀번호는 6자 이상이어야 합니다.',
          },
        })}
      />
      {errors.password && <span className="error-notice">{errors.password.message}</span>}

      {includeConfirmPassword && (
        <>
          <Input
            type="password"
            value={watch('confirmPassword') || ''}
            placeholder="비밀번호를 다시 입력해주세요."
            {...register('confirmPassword', {
              required: '비밀번호를 다시 입력해주세요.',
              validate: (value) => value === password || '비밀번호가 일치하지 않습니다.',
            })}
          />
          {errors.confirmPassword && (
            <span className="error-notice">{errors.confirmPassword.message}</span>
          )}
        </>
      )}

      {firebaseError && <span className="error-notice">{firebaseError}</span>}
      <Button onClick={handleSubmit(onSubmit)}>{title}</Button>
    </FormContainer>
  )
}

const SignUpPage = () => {
  const navigate = useNavigate()
  const auth = getAuth(app)

  const handleSignUp = async ({ email, password }: FormInputs) => {
    await createUserWithEmailAndPassword(auth, email, password)
    navigate('/login')
  }

  return (
    <Container>
      <div className="logo-container">
        <img src={logo} alt="logo-myidoru" />
      </div>

      <Form title="회원가입" onSubmit={handleSignUp} includeConfirmPassword={true} />

      <ButtonLink variant="text" to={PATH.LOGIN}>
        이미 계정이 있으신가요? 로그인하기
      </ButtonLink>
    </Container>
  )
}

export default SignUpPage

const Container = styled.div`
  padding: 62px 20px;

  .logo-container {
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
    font-size: ${fontSize.xl};
    font-weight: ${fontWeight.bold};
  }
`

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  .error-notice {
    color: ${colors.red};
    font-size: ${fontSize.sm};
  }
`
