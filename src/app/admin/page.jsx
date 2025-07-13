'use client'
import BannerComponent from '@/components/banner/Banner'
import { GlobalContainer } from '@/globalStyle'
import React, { useState } from 'react'
import { CardItem, CardList, CardTitle, Container, ViewButton } from './style'
import Link from 'next/link'
import DeleteMock from '@/components/admin/CreateMockModal/DleteMock'
import CreateMockModal from '@/components/admin/CreateMockModal/CreateMockModal'
function Adminpage() {
  const [montMock, setMontMock] = useState([
    {
      id: 1,
      month: "2025-07-01",
      studentsCount: 18
    },
    {
      id: 2,
      month: "2025-08-01",
      studentsCount: 24
    }
  ])

  const addMock = (date) => {
    setMontMock([...montMock, { id: montMock.length + 1, month: date, studentsCount: 24 }])
  }

  const handledelete = (id) => {
    const response = montMock.filter((item) => item.id !== id)
    setMontMock(response)
  }
  return (
    <>
      <GlobalContainer>
        <BannerComponent info={'Siz bu yerda angi mocklar yaratishingiz va natijalarni tekshirib borishingiz mumkin'} />
        <Container>
          <h2>Oylik Mock Testlar <CreateMockModal addMock={addMock} /></h2>
          <CardList>
            {montMock?.map((item) => (
              <CardItem key={item.id}>
                <CardTitle>{item.month}</CardTitle>
                <p>{item.studentsCount} ta o‘quvchi qatnashgan</p>
                <div className="btnbox">
                  <Link className='link' href={`/admin/mock/${item?.id}`}><ViewButton>View</ViewButton> </Link>
                  <DeleteMock handledelete={handledelete} id={item.id} info={`Diqqat qiling agar mockni o'chirib tashlasangiz malumotarni qayat tiklab bo'lmaydi`} />
                </div>
              </CardItem>
            ))}
          </CardList>
        </Container>
      </GlobalContainer>
    </>
  )
}

export default Adminpage